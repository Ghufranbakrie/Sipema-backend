import { FilteringQueryV2, PagedList } from '$entities/Query';
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from '$entities/Service';
import Logger from '$pkg/logger';
import { prisma } from '$utils/prisma.utils';
import { PengaduanMasyarakat } from '@prisma/client';
import { PengaduanMasyarakatDTO } from '$entities/PengaduanMasyarakat';
import { buildFilterQueryLimitOffsetV2 } from './helpers/FilterQueryV2';
import cloudinary from "$utils/cloudinary.utils";
import { ServiceResult, FileUploadResult } from '$entities/responses';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
async function uploadFile(file: File): Promise<ServiceResult<FileUploadResult>> {
    try {
        if (!ALLOWED_FORMATS.includes(file.type)) {
            return {
                status: false,
                error: `Invalid file type. Allowed types: ${ALLOWED_FORMATS.join(', ')}`
            };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64String, {
            folder: 'pengaduan',
            public_id: `${Date.now()}`,
            resource_type: 'auto'
        });

        return {
            status: true,
            data: {
                secure_url: result.secure_url,
                public_id: result.public_id
            }
        };
    } catch (error) {
        Logger.error('File upload error:', error);
        return {
            status: false,
            error: 'Failed to upload file'
        };
    }
}

export async function create(
    data: PengaduanMasyarakatDTO,
    file: File
): Promise<ServiceResult<PengaduanMasyarakat>> {
    try {

        // Upload file
        const uploadResult = await uploadFile(file);
        if (!uploadResult.status || !uploadResult.data) {
            return {
                status: false,
                error: uploadResult.error || 'File upload failed'
            };
        }

        // Create pengaduan
        const pengaduan = await prisma.pengaduanMasyarakat.create({
            data: {
                ...data,
                filePendukung: uploadResult.data.secure_url
            }
        });

        return {
            status: true,
            data: pengaduan
        };

    } catch (error) {
        Logger.error('Create pengaduan error:', error);
        return {
            status: false,
            error: 'Internal server error'
        };
    }
}

export type GetAllResponse = PagedList<PengaduanMasyarakat[]> | {}
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters)

        const [pengaduanMasyarakat, totalData] = await Promise.all([
            prisma.pengaduanMasyarakat.findMany(usedFilters),
            prisma.pengaduanMasyarakat.count({
                where: usedFilters.where
            })
        ])

        let totalPage = 1
        if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take)

        return {
            status: true,
            data: {
                entries: pengaduanMasyarakat,
                totalData,
                totalPage
            }
        }
    } catch (err) {
        Logger.error(`PengaduanMasyarakatService.getAll : ${err} `)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}



export type GetByIdResponse = PengaduanMasyarakat | {}
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
    try {
        let pengaduanMasyarakat = await prisma.pengaduanMasyarakat.findUnique({
            where: {
                id
            }
        });

        if (!pengaduanMasyarakat) return INVALID_ID_SERVICE_RESPONSE

        return {
            status: true,
            data: pengaduanMasyarakat
        }
    } catch (err) {
        Logger.error(`PengaduanMasyarakatService.getById : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export type UpdateResponse = PengaduanMasyarakat | {}
export async function update(id: string, data: PengaduanMasyarakatDTO): Promise<ServiceResponse<UpdateResponse>> {
    try {
        let pengaduanMasyarakat = await prisma.pengaduanMasyarakat.findUnique({
            where: {
                id
            }
        });

        if (!pengaduanMasyarakat) return INVALID_ID_SERVICE_RESPONSE

        pengaduanMasyarakat = await prisma.pengaduanMasyarakat.update({
            where: {
                id
            },
            data
        })

        return {
            status: true,
            data: pengaduanMasyarakat
        }
    } catch (err) {
        Logger.error(`PengaduanMasyarakatService.update : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
    try {
        const idArray: string[] = JSON.parse(ids)

        idArray.forEach(async (id) => {
            await prisma.pengaduanMasyarakat.delete({
                where: {
                    id
                }
            })
        })

        return {
            status: true,
            data: {}
        }
    } catch (err) {
        Logger.error(`PengaduanMasyarakatService.deleteByIds : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}




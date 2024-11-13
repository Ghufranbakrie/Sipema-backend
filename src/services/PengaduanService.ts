import { FilteringQueryV2, PagedList } from '$entities/Query';
import {
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from '$entities/Service';
import { prisma } from '$utils/prisma.utils';
import { Pengaduan } from '@prisma/client';
import { PengaduanDTO, PengaduanCreateDTO } from '$entities/Pengaduan';
import { validateCreatePengaduan } from '$validations/PengaduanValidator';
import { ErrorHandler } from '$utils/errorHandler';
import Logger from '$pkg/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { buildFilterQueryLimitOffsetV2 } from './helpers/FilterQueryV2';

export type CreateResponse = Pengaduan | {}
export async function create(data: PengaduanCreateDTO): Promise<ServiceResponse<CreateResponse>> {
    try {
        // Validate input data
        const validatedData = await validateCreatePengaduan(data);

        // Create pengaduan
        const pengaduan = await prisma.pengaduan.create({
            data: validatedData,
            include: {
                pelapor: {
                    select: {
                        name: true,
                        no_identitas: true
                    }
                },
                unit: {
                    select: {
                        nama_unit: true
                    }
                }
            }
        });

        return {
            status: true,
            data: pengaduan
        };

    } catch (error) {
        // If error is a ServiceResponse (from validator), return it directly
        if (typeof error === 'object' && error !== null && 'status' in error && !error.status) {
            return error as ServiceResponse<CreateResponse>;
        }

        // Handle Prisma errors
        if (error instanceof PrismaClientKnownRequestError) {
            Logger.error(`Database Error: ${error.code} - ${error.message}`);
            return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }

        // Handle other errors
        Logger.error(`Service Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        return ErrorHandler.handleServiceError(error);
    }
}

export type GetAllResponse = PagedList<Pengaduan[]> | {}
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters)

        const [Pengaduan, totalData] = await Promise.all([
            prisma.pengaduan.findMany(usedFilters),
            prisma.pengaduan.count({
                where: usedFilters.where
            })
        ])

        let totalPage = 1
        if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take)

        return {
            status: true,
            data: {
                entries: Pengaduan,
                totalData,
                totalPage
            }
        }
    } catch (err) {
        Logger.error(`PengaduanService.getAll : ${err} `)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}



export type GetByIdResponse = Pengaduan | {}
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
    try {
        let Pengaduan = await prisma.pengaduan.findUnique({
            where: {
                id
            }
        });

        if (!Pengaduan) return INVALID_ID_SERVICE_RESPONSE

        return {
            status: true,
            data: Pengaduan
        }
    } catch (err) {
        Logger.error(`PengaduanService.getById : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export type UpdateResponse = Pengaduan | {}
export async function update(id: string, data: PengaduanDTO): Promise<ServiceResponse<UpdateResponse>> {
    try {
        let Pengaduan = await prisma.pengaduan.findUnique({
            where: {
                id
            }
        });

        if (!Pengaduan) return INVALID_ID_SERVICE_RESPONSE

        Pengaduan = await prisma.pengaduan.update({
            where: {
                id
            },
            data: {
                ...data,
                pelapor: {
                    connect: { id: data.pelapor.no_identitas }
                },
                unit: {
                    connect: { id: data.unit.nama_unit }
                }
            }
        })

        return {
            status: true,
            data: Pengaduan
        }
    } catch (err) {
        Logger.error(`PengaduanService.update : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
    try {
        const idArray: string[] = JSON.parse(ids)

        idArray.forEach(async (id) => {
            await prisma.pengaduan.delete({
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
        Logger.error(`PengaduanService.deleteByIds : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}


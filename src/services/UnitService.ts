import { FilteringQueryV2, PagedList } from '$entities/Query';
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse, BadRequestWithMessage, ConflictResponse } from '$entities/Service';
import Logger from '$pkg/logger';
import { prisma } from '$utils/prisma.utils';
import { Unit } from '@prisma/client';
import { UnitDTO } from '$entities/Unit';
import { buildFilterQueryLimitOffsetV2 } from './helpers/FilterQueryV2';

export type CreateResponse = Unit | {}
export async function create(data: UnitDTO): Promise<ServiceResponse<CreateResponse>> {
    try {

        const unitExist = await prisma.unit.findUnique({
            where: {
                nama_unit: data.nama_unit
            }
        });

        if (unitExist) {
            return ConflictResponse("Unit with this name already exists");
        }

        const transformedData = {
            ...data,
            petugas: data.petugas ? { connect: { no_identitas: data.petugas.no_identitas } } : undefined
        };

        const Unit = await prisma.unit.create({
            data: transformedData
        })

        return {
            status: true,
            data: Unit
        }
    } catch (err) {
        Logger.error(`unitService.create : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export type GetAllResponse = PagedList<Unit[]> | {}
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters)

        const [Unit, totalData] = await Promise.all([
            prisma.unit.findMany({
                ...usedFilters,
                include: {
                    petugas: {
                        select: {
                            no_identitas: true,
                            name: true
                        }
                    }
                }
            }),
            prisma.unit.count({
                where: usedFilters.where
            })
        ])

        let totalPage = 1
        if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take)

        return {
            status: true,
            data: {
                entries: Unit,
                totalData,
                totalPage
            }
        }
    } catch (err) {
        Logger.error(`unitService.getAll : ${err} `)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}



export type GetByIdResponse = Unit | {}
export async function getById(nama_unit: string): Promise<ServiceResponse<GetByIdResponse>> {
    try {
        let Unit = await prisma.unit.findUnique({
            where: {
                nama_unit,
            }
        });

        if (!Unit) return INVALID_ID_SERVICE_RESPONSE

        return {
            status: true,
            data: Unit
        }
    } catch (err) {
        Logger.error(`unitService.getById : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export type UpdateResponse = Unit | {}
export async function update(nama_unit: string, data: UnitDTO): Promise<ServiceResponse<UpdateResponse>> {
    try {
        // Check if unit exists
        let unit = await prisma.unit.findUnique({
            where: { nama_unit }
        });

        if (!unit) {
            return BadRequestWithMessage("Unit not found");
        }

        // Prepare update data
        const updateData: any = {
            nama_unit: data.nama_unit
        };
        let unitExist = await prisma.unit.findUnique({
            where: { nama_unit: data.nama_unit }
        })

        if (unitExist) return ConflictResponse("Unit has ready used")

        // Only check and connect petugas if provided
        if (data.petugas?.no_identitas) {
            const user = await prisma.user.findUnique({
                where: {
                    no_identitas: data.petugas.no_identitas
                }
            });

            if (!user) {
                return BadRequestWithMessage("Petugas not found");
            }
            updateData.petugas = {
                connect: {
                    no_identitas: data.petugas.no_identitas
                }
            };
        }

        // Update unit
        const updatedUnit = await prisma.unit.update({
            where: { nama_unit },
            data: updateData,
            include: {
                petugas: {
                    select: {
                        no_identitas: true,
                        name: true
                    }
                }
            }
        });

        return {
            status: true,
            data: updatedUnit
        };

    } catch (err) {
        Logger.error(`UnitService.update : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}


export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
    try {
        const idArray: string[] = JSON.parse(ids)

        idArray.forEach(async (nama_unit) => {
            await prisma.unit.delete({
                where: {
                    nama_unit
                }
            })
        })

        return {
            status: true,
            data: {}
        }
    } catch (err) {
        Logger.error(`unitService.deleteByIds : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}


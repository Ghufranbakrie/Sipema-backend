import { Context, TypedResponse } from "hono"
import * as PengaduanService from "$services/PengaduanService"
import { handleServiceErrorWithResponse, response_created, response_forbidden, response_success } from "$utils/response.utils"
import { PengaduanDTO } from "$entities/Pengaduan"
import { FilteringQueryV2 } from "$entities/Query"
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery"
import { prisma } from "$utils/prisma.utils"

export async function create(c: Context): Promise<TypedResponse> {
    const data: PengaduanDTO = await c.req.json();

    const serviceResponse = await PengaduanService.create(data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_created(c, serviceResponse.data, "Successfully created new Pengaduan!");
}

export async function getAllByUnit(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

    // Get officer info from JWT
    const jwtPayload = c.get("jwtPayload") as any;
    const noIdentitas = jwtPayload.no_identitas;

    // Get officer's unit assignment
    const officerUnit = await prisma.unit.findUnique({
        where: {
            petugasId: noIdentitas
        }
    });

    // Check if officer is assigned to a unit
    if (!officerUnit) {
        return response_forbidden(c, "You are not assigned to any unit");
    }

    // Add filter for unit
    filters.filters = {
        ...filters.filters,
        nameUnit: officerUnit.nama_unit
    };

    const serviceResponse = await PengaduanService.getAll(filters);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched unit complaints!");
}

export async function getAllByUser(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

    const jwtPayload = c.get("jwtPayload") as any;
    const noIdentitas = jwtPayload.no_identitas;


    // Tambahkan filter untuk pelaporId
    filters.filters = {
        ...filters.filters,
        pelaporId: noIdentitas // Gunakan no_identitas sebagai pelaporId
    };

    const serviceResponse = await PengaduanService.getAll(filters);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched user's complaints!");
}




export async function getAll(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c)

    const serviceResponse = await PengaduanService.getAll(filters)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all Pengaduan!")
}

export async function getById(c: Context): Promise<TypedResponse> {
    const id = c.req.param('id')

    const serviceResponse = await PengaduanService.getById(id)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched Pengaduan by id!")
}

export async function update(c: Context): Promise<TypedResponse> {
    const data: PengaduanDTO = await c.req.json()
    const id = c.req.param('id')

    const serviceResponse = await PengaduanService.update(id, data)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully updated Pengaduan!")
}

export async function deleteByIds(c: Context): Promise<TypedResponse> {
    const ids = c.req.query('ids') as string

    const serviceResponse = await PengaduanService.deleteByIds(ids)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully deleted Pengaduan!")
}

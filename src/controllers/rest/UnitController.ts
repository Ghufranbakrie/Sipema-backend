import { Context, TypedResponse } from "hono"
import * as unitService from "$services/UnitService"
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils"
import { UnitDTO } from "$entities/Unit"
import { FilteringQueryV2 } from "$entities/Query"
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery"

export async function create(c: Context): Promise<TypedResponse> {
    const data: UnitDTO = await c.req.json();

    const serviceResponse = await unitService.create(data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_created(c, serviceResponse.data, "Successfully created new unit!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c)

    const serviceResponse = await unitService.getAll(filters)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all unit!")
}

export async function getById(c: Context): Promise<TypedResponse> {
    const id = c.req.param('id')

    const serviceResponse = await unitService.getById(id)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched unit by id!")
}

export async function update(c: Context): Promise<TypedResponse> {
    const data: UnitDTO = await c.req.json()
    const id = c.req.param('id')

    const serviceResponse = await unitService.update(id, data)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully updated unit!")
}

export async function deleteByIds(c: Context): Promise<TypedResponse> {
    const ids = c.req.query('ids') as string

    const serviceResponse = await unitService.deleteByIds(ids)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully deleted unit!")
}

import {Context, TypedResponse} from "hono"
import * as KategoriService from "$services/KategoriService"
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils"
import { KategoriDTO } from "$entities/Kategori"
import { FilteringQueryV2 } from "$entities/Query"
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery"

export async function create(c:Context): Promise<TypedResponse> {
    const data: KategoriDTO = await c.req.json();

    const serviceResponse = await KategoriService.create(data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_created(c, serviceResponse.data, "Successfully created new Kategori!");
}

export async function getAll(c:Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c)

    const serviceResponse = await KategoriService.getAll(filters)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all Kategori!")
}

export async function getById(c:Context): Promise<TypedResponse> {
    const id = c.req.param('id')

    const serviceResponse = await KategoriService.getById(id)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched Kategori by id!")
}

export async function update(c:Context): Promise<TypedResponse> {
    const data: KategoriDTO = await c.req.json()
    const id = c.req.param('id')

    const serviceResponse = await KategoriService.update(id, data)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully updated Kategori!")
}

export async function deleteByIds(c:Context): Promise<TypedResponse> {
    const ids = c.req.query('ids') as string

    const serviceResponse = await KategoriService.deleteByIds(ids)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully deleted Kategori!")
}
    
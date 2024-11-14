import { Context, Next } from 'hono';
import { response_bad_request } from '$utils/response.utils';
import { ErrorStructure, generateErrorStructure } from './helper'

import { KategoriDTO } from '$entities/Kategori'

export async function validateKategoriDTO(c: Context, next: Next) {
    const data: KategoriDTO = await c.req.json()
    const invalidFields: ErrorStructure[] = [];
    if (!data.nama) invalidFields.push(generateErrorStructure("nama", "nama cannot be empty"))

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields)
    await next()
}

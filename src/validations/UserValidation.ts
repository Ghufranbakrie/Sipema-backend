import { Context, Next } from 'hono';
import { response_bad_request } from '$utils/response.utils';
import { ErrorStructure, generateErrorStructure } from './helper'

import { UserRegisterDTO } from '$entities/User'

export async function validateUserRegisterDTO(c: Context, next: Next) {
    const data: UserRegisterDTO = await c.req.json()
    const invalidFields: ErrorStructure[] = [];
    if (!data.email) invalidFields.push(generateErrorStructure("email", " cannot be empty"))
    if (!data.name) invalidFields.push(generateErrorStructure("name", " cannot be empty"))
    if (!data.password) invalidFields.push(generateErrorStructure("password", " cannot be empty"))
    if (!data.no_identitas) invalidFields.push(generateErrorStructure("no_identitas", " cannot be empty"))
    if (!data.role) invalidFields.push(generateErrorStructure("role", " cannot be empty"))


    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields)
    await next()
}



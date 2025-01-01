// UnitValidation.ts
import { Context, Next } from 'hono';
import { response_bad_request } from '$utils/response.utils';
import { ErrorStructure, generateErrorStructure, generateErrorStructureParams } from './helper';
import { UnitCreateDTO, UnitUpdateDTO } from '$entities/Unit';
import { prisma } from '$utils/prisma.utils';

export async function validateUnitCreateDTO(c: Context, next: Next) {

    const data: UnitCreateDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    // Basic validations
    if (!data.nama_unit) {
        invalidFields.push(generateErrorStructure("nama_unit", "cannot be empty"));
    }
    if (!data.petugasId) {
        invalidFields.push(generateErrorStructure("petugasId", "cannot be empty"));
    }
    // Validate petugas if provided
    if (data.petugasId) {
        // Check if user exists and is a PETUGAS
        const existingUser = await prisma.user.findUnique({
            where: { no_identitas: data.petugasId }
        });

        if (!existingUser) {
            invalidFields.push(generateErrorStructure("petugasId", "user not found"));
        } else if (existingUser.role !== "PETUGAS") {
            invalidFields.push(generateErrorStructure("petugasId", "user does not have the required role"));
        }

        // Check if petugas is already assigned to another unit
        const existingAssignment = await prisma.unit.findUnique({
            where: { petugasId: data.petugasId }
        });

        if (existingAssignment) {
            invalidFields.push(generateErrorStructure("petugasId", "user is already assigned to a unit"));
        }
    }
    // Check if unit name already exists
    const existingUnit = await prisma.unit.findUnique({
        where: { nama_unit: data.nama_unit }
    });

    if (existingUnit) {
        invalidFields.push(generateErrorStructure("nama_unit", "unit name already exists"));
    }

    // Return validation errors if any
    if (invalidFields.length > 0) {
        return response_bad_request(c, "Validation Error", invalidFields);
    }
    await next();
}

export async function validateUnitUpdateDTO(c: Context, next: Next) {
    const data: UnitUpdateDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    // Validate petugas if provided
    if (data.petugasId) {
        // Check if user exists and is a PETUGAS
        const existingUser = await prisma.user.findUnique({
            where: { no_identitas: data.petugasId }
        });

        if (!existingUser) {
            invalidFields.push(generateErrorStructure("petugasId", "user not found"));
        } else if (existingUser.role !== "PETUGAS") {
            invalidFields.push(generateErrorStructure("petugasId", "user does not have the required role"));
        }

        // Check if petugas is already assigned to another unit
        const existingAssignment = await prisma.unit.findUnique({
            where: { petugasId: data.petugasId }
        });

        if (existingAssignment) {
            invalidFields.push(generateErrorStructure("petugasId", "user is already assigned to a unit"));
        }
    }
    await next();
}

export async function validationDeletedUnit(c: Context, next: Next) {
    const ids = c.req.query('ids') as string;
    const invalidFields: ErrorStructure[] = [];
    if (!ids) {
        invalidFields.push(generateErrorStructureParams("ids", " cannot be empty"));
        return response_bad_request(c, "Validation Error", invalidFields);
    }
    const idArray: string[] = JSON.parse(ids);
    // Check all unit exist before proceeding
    await Promise.all(
        idArray.map(async (id) => {
            const unit = await prisma.unit.findUnique({
                where: { id }
            });
            if (!unit) {
                invalidFields.push(generateErrorStructureParams("ids", `User with id: ${id} not found`));
            }
            return unit;
        })
    );

    if (invalidFields.length !== 0) {
        return response_bad_request(c, "Validation Error", invalidFields);
    }
    await next();
}
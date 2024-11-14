// UnitValidation.ts
import { Context, Next } from 'hono';
import { response_bad_request } from '$utils/response.utils';
import { ErrorStructure, generateErrorStructure } from './helper';
import { z } from "zod";
import { UnitCreateDTO, UnitUpdateDTO } from '$entities/Unit';
import { prisma } from '$utils/prisma.utils';

export async function validateUnitCreateDTO(c: Context, next: Next) {
    try {
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

        // Store validated data
        c.set('unitData', data);
        return next();
    } catch (error) {
        return response_bad_request(c, "Invalid request body");
    }
}

export async function validateUnitUpdateDTO(c: Context, next: Next) {
    try {
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
    } catch (error) {
        return response_bad_request(c, "Invalid request body");
    }
}



// Request body schema
export const CreateUnitSchema = z.object({
    nama_unit: z
        .string()
        .min(1, "Unit name is required")
        .max(100, "Unit name is too long"),
    petugasId: z
        .string()
        .nullable()
        .optional(),
});

export type CreateUnitRequest = z.infer<typeof CreateUnitSchema>;
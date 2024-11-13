
import { z } from "zod";


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

// Type inference
export type CreateUnitRequest = z.infer<typeof CreateUnitSchema>;

// Validation function
export const validateCreateUnit = (data: unknown) => {
    return CreateUnitSchema.parse(data);
};

// Optional: Add error messages
export const CreateUnitErrors = {
    REQUIRED_NAME: "Unit name is required",
    NAME_TOO_LONG: "Unit name must not exceed 100 characters",
    INVALID_PETUGAS: "Invalid petugas ID format",
};
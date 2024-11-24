// PengaduanMasyarakatValidation.ts
import { Context, Next } from 'hono';
import { response_bad_request } from '$utils/response.utils';
import { ErrorStructure, generateErrorStructure } from './helper'
// import { PengaduanMasyarakatDTO } from '$entities/PengaduanMasyarakat'
import { prisma } from '$utils/prisma.utils';

export async function validatePengaduanMasyarakatDTO(c: Context, next: Next) {
    try {
        const formData = await c.req.parseBody();
        const file = formData.file as File;
        const invalidFields: ErrorStructure[] = [];

        // File validation
        if (!file) {
            invalidFields.push(generateErrorStructure("file", "is required"));
        } else {
            const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!ALLOWED_FORMATS.includes(file.type)) {
                invalidFields.push(generateErrorStructure("file", `invalid format. Allowed: ${ALLOWED_FORMATS.join(', ')}`));
            }
        }

        // Form fields validation
        if (!formData.deskripsi) invalidFields.push(generateErrorStructure("deskripsi", "cannot be empty"));
        if (!formData.judul) invalidFields.push(generateErrorStructure("judul", "cannot be empty"));
        if (!formData.kategoriId) invalidFields.push(generateErrorStructure("kategoriId", "cannot be empty"));
        
        if (formData.kategoriId) {
            const kategori = await prisma.kategori.findUnique({
                where: { id: String(formData.kategoriId) }
            });
            if (!kategori) invalidFields.push(generateErrorStructure("kategoriId", "is not valid. Category not found"));
        }

        if (!formData.nama) invalidFields.push(generateErrorStructure("nama", "cannot be empty"));
        if (!formData.nameUnit) invalidFields.push(generateErrorStructure("nameUnit", "cannot be empty"));
        
        if (formData.nameUnit) {
            const unit = await prisma.unit.findUnique({
                where: { nama_unit: String(formData.nameUnit) }
            });
            if (!unit) invalidFields.push(generateErrorStructure("nameUnit", "is not valid. Unit not found"));
        }

        if (!formData.no_telphone) invalidFields.push(generateErrorStructure("no_telphone", "cannot be empty"));

        // Check duplicates
        if (formData.judul && formData.deskripsi && formData.nameUnit && formData.kategoriId) {
            const existingReport = await prisma.pengaduanMasyarakat.findFirst({
                where: {
                    AND: [
                        { judul: String(formData.judul) },
                        { deskripsi: String(formData.deskripsi) },
                        { nameUnit: String(formData.nameUnit) },
                        { kategoriId: String(formData.kategoriId) },
                        { nama: String(formData.nama) }
                    ]
                }
            });
            if (existingReport) {
                invalidFields.push(generateErrorStructure("report", "duplicate report found"));
            }
        }

        if (invalidFields.length > 0) {
            return response_bad_request(c, "Invalid Fields", invalidFields);
        }

        await next();
    } catch (error) {
        return response_bad_request(c, "Invalid request format");
    }
}
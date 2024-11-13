// src/validations/PengaduanValidator.ts

import { z } from "zod";
import { Status } from "@prisma/client";
import { prisma } from "$utils/prisma.utils";
import { ConflictResponse } from "$entities/Service";

const createPengaduanSchema = z.object({
    judul: z
        .string()
        .min(5, "Judul harus minimal 5 karakter")
        .max(100, "Judul tidak boleh lebih dari 100 karakter")
        .trim(),
    deskripsi: z
        .string()
        .min(10, "Deskripsi harus minimal 10 karakter")
        .trim(),
    nameUnit: z
        .string()
        .min(1, "Unit tujuan harus dipilih"),
    pelaporId: z
        .string()
        .min(1, "ID Pelapor tidak valid")
});

export type CreatePengaduanRequest = z.infer<typeof createPengaduanSchema>;

export async function validateCreatePengaduan(data: unknown) {
    // Step 1: Basic schema validation
    const validatedData = createPengaduanSchema.parse(data);

    // Step 2: Check for similar active complaints
    const existingComplaints = await prisma.pengaduan.findFirst({
        where: {
            AND: [
                { pelaporId: validatedData.pelaporId },
                {
                    OR: [
                        // Check similar title
                        {
                            judul: {
                                contains: validatedData.judul,
                                mode: 'insensitive'
                            }
                        },
                        // Check similar description
                        {
                            deskripsi: {
                                contains: validatedData.deskripsi,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                { nameUnit: validatedData.nameUnit },
                // Only check recent complaints (last 24 hours)
                {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                },
                // Only check active complaints
                {
                    status: {
                        in: [Status.PENDING, Status.PROCESS]
                    }
                }
            ]
        }
    });

    if (existingComplaints) {
        throw ConflictResponse(
            "Anda sudah memiliki pengaduan serupa yang masih dalam proses. " +
            "Mohon tunggu respon untuk pengaduan sebelumnya atau hubungi unit terkait."
        );
    }

    // Step 3: Check complaint frequency
    // const recentComplaints = await prisma.pengaduan.count({
    //     where: {
    //         AND: [
    //             { pelaporId: validatedData.pelaporId },
    //             {
    //                 createdAt: {
    //                     gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    //                 }
    //             }
    //         ]
    //     }
    // });

    // if (recentComplaints >= 3) {
    //     throw ConflictResponse(
    //         "Anda telah mencapai batas maksimum pengaduan dalam 24 jam. " +
    //         "Silakan coba lagi besok."
    //     );
    // }

    return validatedData;
}


export const PengaduanValidationErrors = {
    DUPLICATE_COMPLAINT: "Pengaduan serupa sudah ada dan masih dalam proses",
    FREQUENCY_LIMIT: "Telah mencapai batas maksimum pengaduan dalam 24 jam",
    INVALID_TITLE: "Judul pengaduan tidak valid",
    INVALID_DESCRIPTION: "Deskripsi pengaduan tidak valid",
    INVALID_UNIT: "Unit tujuan tidak valid",
    INVALID_REPORTER: "Data pelapor tidak valid"
};
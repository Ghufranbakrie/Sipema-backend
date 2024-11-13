// src/entities/Pengaduan.ts

import { Status, User, Unit } from "@prisma/client"

// Base Pengaduan interface
export interface Pengaduan {
    id: string
    judul: string
    deskripsi: string
    status: Status
    response: string | null
    createdAt: Date
    updatedAt: Date
    pelaporId: string
    pelapor?: User
    nameUnit: string  // Changed from namaUnit to match schema
    unit?: Unit
}

// DTO for creating new Pengaduan
export interface PengaduanCreateDTO {
    judul: string
    deskripsi: string
    nameUnit: string  // Changed from unitId to match schema
    pelaporId: string
}

// DTO for updating Pengaduan
export interface PengaduanUpdateDTO {
    judul?: string
    deskripsi?: string
    status?: Status
    response?: string | null
    nameUnit?: string  // Changed from namaUnit to match schema
}

// DTO for response from service
export interface PengaduanDTO {
    id: string
    judul: string
    deskripsi: string
    status: Status
    response: string | null
    createdAt: Date
    updatedAt: Date
    pelapor: {
        id: string
        name: string
        no_identitas: string
    }
    unit: {
        id: string
        nama_unit: string
        petugasId: string | null
    }
}
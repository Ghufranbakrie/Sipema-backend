// src/entities/Pengaduan.ts

import { Status, User, Unit } from "@prisma/client"

// Base Pengaduan interface
export interface Pengaduan {
    id: string
    judul: string
    deskripsi: string
    status: Status
    response?: string | null
    createdAt: Date
    updatedAt: Date
    pelaporId: string
    pelapor?: User
    unitId: string
    unit?: Unit
}

// DTO for creating new Pengaduan
export interface PengaduanCreateDTO {
    judul: string
    deskripsi: string
    unitId: string
    pelaporId: string
}

// DTO for updating Pengaduan
export interface PengaduanUpdateDTO {
    judul?: string
    deskripsi?: string
    status?: Status
    response?: string
    unitId?: string
}

// DTO for response from service
export interface PengaduanDTO {
    id: string
    judul: string
    deskripsi: string
    status: Status
    response?: string
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
    }
}
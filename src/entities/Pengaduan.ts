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
    kategoriId: string
    pelapor?: User
    nameUnit: string
    unit?: Unit
}

// DTO for creating new Pengaduan
export interface PengaduanCreateDTO {
    judul: string
    deskripsi: string
    nameUnit: string
    pelaporId: string
    kategoriId: string
}

// DTO for updating Pengaduan
export interface PengaduanUpdateDTO {
    judul?: string
    deskripsi?: string
    status?: Status
    response?: string | null
    nameUnit?: string  // Changed from namaUnit to match schema
}


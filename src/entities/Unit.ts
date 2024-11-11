// src/entities/Unit.ts

import { User, Pengaduan } from "@prisma/client"

// Base Unit interface
export interface Unit {
    id: string
    nama_unit: string
    petugasId?: string | null
    petugas?: User
    pengaduan?: Pengaduan[]
}

// DTO for creating new Unit
export interface UnitCreateDTO {
    nama_unit: string
    petugasId?: string
}

// DTO for updating Unit
export interface UnitUpdateDTO {
    nama_unit?: string
    petugasId?: string | null
}

// DTO for Unit response
export interface UnitDTO {
    id: string
    nama_unit: string
    petugas?: {
        id: string
        name: string
        email: string
        no_identitas: string
    }
}
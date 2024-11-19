// PengaduanMasyarakat.ts
import { Status } from "@prisma/client";

export interface PengaduanMasyarakatDTO {
    judul: string;
    deskripsi: string;
    status: Status;
    nameUnit: string;
    response: string;
    kategoriId: string;
    nama: string;
    no_telphone: string;
}


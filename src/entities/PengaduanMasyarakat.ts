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
    filePendukung: string;
}

interface ParsedFormData {
    [key: string]: string | File;
}

export class PengaduanMasyarakatEntity implements PengaduanMasyarakatDTO {
    judul: string;
    deskripsi: string;
    status: Status;
    nameUnit: string;
    response: string;
    kategoriId: string;
    nama: string;
    no_telphone: string;
    filePendukung: string;

    private constructor(data: Partial<PengaduanMasyarakatDTO>) {
        this.judul = data.judul || '';
        this.deskripsi = data.deskripsi || '';
        this.status = data.status || Status.PENDING;
        this.nameUnit = data.nameUnit || '';
        this.response = data.response || '';
        this.kategoriId = data.kategoriId || '';
        this.nama = data.nama || '';
        this.no_telphone = data.no_telphone || '';
        this.filePendukung = data.filePendukung || '';
    }

    toDTO(): PengaduanMasyarakatDTO {
        return {
            judul: this.judul,
            deskripsi: this.deskripsi,
            status: this.status,
            nameUnit: this.nameUnit,
            response: this.response,
            kategoriId: this.kategoriId,
            nama: this.nama,
            no_telphone: this.no_telphone,
            filePendukung: this.filePendukung
        };
    }
    static fromParsedBody(formData: ParsedFormData): PengaduanMasyarakatEntity {
        return new PengaduanMasyarakatEntity({
            judul: String(formData.judul || ''),
            deskripsi: String(formData.deskripsi || ''),
            status: formData.status as Status || Status.PENDING,
            nameUnit: String(formData.nameUnit || ''),
            response: String(formData.response || ''),
            kategoriId: String(formData.kategoriId || ''),
            nama: String(formData.nama || ''),
            no_telphone: String(formData.no_telphone || ''),
            filePendukung: ''
        });
    }
}

export interface UploadResponse {
    secure_url: string;
    public_id: string;
}
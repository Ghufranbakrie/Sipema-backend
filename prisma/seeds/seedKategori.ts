import { PrismaClient } from '@prisma/client';

export async function seedKategori(prisma: PrismaClient) {
    const countKategori = await prisma.kategori.count();
    if (countKategori === 0) {
        await prisma.kategori.create({
            data: {
                nama: "Elektronik"
            }
        });
        await prisma.kategori.create({
            data: {
                nama: "Furniture"
            }
        });
        await prisma.kategori.create({
            data: {
                nama: "Kendaraan"
            }
        });
        await prisma.kategori.create({
            data: {
                nama: "Perlengkapan Rumah"
            }
        });
        await prisma.kategori.create({
            data: {
                nama: "Peralatan Kantor"
            }
        });
        console.log("Kategori seeded");
    }
}
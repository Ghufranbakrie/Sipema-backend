import { PrismaClient, Roles } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ulid } from 'ulid';

export async function seedAdmin(prisma: PrismaClient) {
    // Check existing users for each role
    const countAdmin = await prisma.user.count({ where: { role: Roles.ADMIN } });
    const countUser = await prisma.user.count({ where: { role: Roles.USER } });
    const countPetugasSuper = await prisma.user.count({ where: { role: Roles.PETUGAS_SUPER } });
    const countPetugas = await prisma.user.count({ where: { role: Roles.PETUGAS } });


    // Admin seed
    if (countAdmin === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 12);
        await prisma.user.create({
            data: {
                id: ulid(),
                name: "Admin",
                no_identitas: "admin1",
                password: hashedPassword,
                email: "admin@test.com",
                role: Roles.ADMIN,
                program_studi: "ADMIN"
            }
        });
        console.log("Admin seeded");
    }

    // User seed
    if (countUser === 0) {
        const hashedPassword = await bcrypt.hash("user123", 12);
        await prisma.user.create({
            data: {
                id: ulid(),
                name: "User",
                no_identitas: "user1",
                password: hashedPassword,
                email: "user@test.com",
                role: Roles.USER,
                program_studi: "Teknik Informatika"
            }
        });
        console.log("User seeded");
    }

    // Petugas Super seed
    if (countPetugasSuper === 0) {
        const hashedPassword = await bcrypt.hash("super123", 12);
        await prisma.user.create({
            data: {
                id: ulid(),
                name: "Petugas Super",
                no_identitas: "super1",
                password: hashedPassword,
                email: "super@test.com",
                role: Roles.PETUGAS_SUPER,
                program_studi: "SUPER"
            }
        });
        console.log("Petugas Super seeded");
    }

    // Create Unit first
    if (countPetugas === 0) {
        const unit = await prisma.unit.create({
            data: {
                id: ulid(),
                nama_unit: "Unit TI"
            }
        });

        // Petugas seed with unit assignment
        const hashedPassword = await bcrypt.hash("petugas123", 12);
        await prisma.user.create({
            data: {
                id: ulid(),
                name: "Petugas Unit TI",
                no_identitas: "petugas1",
                password: hashedPassword,
                email: "petugas@test.com",
                role: Roles.PETUGAS,
                program_studi: "Teknik Informatika",
                unit_petugas: {
                    connect: {
                        id: unit.id
                    }
                }
            }
        });
        console.log("Petugas and Unit seeded");
    }

    console.log("All roles seeding completed");
}
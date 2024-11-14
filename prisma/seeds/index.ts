import "../../src/paths"
import { seedAdmin } from "./seedAdmin";
import { prisma } from '../../src/utils/prisma.utils';
import { seedKategori } from "./seedKategori";


async function seed() {
    await seedAdmin(prisma)
    await seedKategori(prisma)
}

seed().then(() => {
    console.log("ALL SEEDING DONE")
})
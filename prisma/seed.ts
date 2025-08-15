// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const data: Prisma.PlywoodProductCreateManyInput[] = [
    { type: 'ФСФ', thickness: 12, format: '2500x1250', grade: 'BB/BB (2/2)', manufacturer: 'Україна', waterproofing: 'Підвищена', price: 850, image: '/plywood/fsf.png', inStock: true },
    { type: 'ФК',  thickness: 9,  format: '2500x1250', grade: 'B/BB (1/2)', manufacturer: 'Одек',    waterproofing: 'Підвищена', price: 720, image: '/plywood/fk.png',  inStock: true },
    { type: 'Ламінована', thickness: 15, format: '3000x1500', grade: 'BB/C (2/4)', manufacturer: 'Україна', waterproofing: 'Водостійка', price: 1250, image: '/plywood/laminated.png', inStock: false },
]

async function main() {
    for (const d of data) {
        const existing = await prisma.plywoodProduct.findFirst({
            where: {
                type: d.type,
                thickness: d.thickness,
                format: d.format,
                grade: d.grade,
                manufacturer: d.manufacturer,
            },
            select: { id: true },
        })

        if (existing) {
            await prisma.plywoodProduct.update({
                where: { id: existing.id },
                data: d,
            })
        } else {
            await prisma.plywoodProduct.create({ data: d })
        }
    }
    console.log('🌱 Seed успішно виконано')
}

main().finally(() => prisma.$disconnect())
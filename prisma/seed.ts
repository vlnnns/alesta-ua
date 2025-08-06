import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.plywoodProduct.createMany({
        data: [
            {
                type: 'ФСФ',
                thickness: 12,
                format: '2500x1250',
                grade: 'BB/BB (2/2)',
                manufacturer: 'Україна',
                waterproofing: 'Підвищена',
                price: 850,
                image: '/plywood/fsf.jpg',
            },
            {
                type: 'ФК',
                thickness: 9,
                format: '2500x1250',
                grade: 'B/BB (1/2)',
                manufacturer: 'Одек',
                waterproofing: 'Підвищена',
                price: 720,
                image: '/plywood/fk.jpg',
            },
            {
                type: 'Ламінована',
                thickness: 15,
                format: '3000x1500',
                grade: 'BB/C (2/4)',
                manufacturer: 'Україна',
                waterproofing: 'Водостійка',
                price: 1250,
                image: '/plywood/laminated.jpg',
            },
            // додай ще варіанти при потребі
        ],
    })
}

main()
    .then(() => {
        console.log('🌱 Seed успішно виконано')
        return prisma.$disconnect()
    })
    .catch((e) => {
        console.error(e)
        return prisma.$disconnect()
    })

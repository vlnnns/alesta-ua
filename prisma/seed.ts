// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

type Catalog = {
    type: string
    thicknesses: number[]
    formats: string[]
    grades: string[]        // для Ламінованої та Транспортної — []
    waterproofing: string
    image: string
    priceBase: number
    pricePerMm: number
}

const CATALOG: Catalog[] = [
    {
        type: 'ФСФ',
        thicknesses: [4,6,6.5,7,9,9.5,10,12,15,18,21,24,27,30,35,40],
        formats: ['2500x1250','3000x1500'],
        grades: ['B/BB (1/2)','BB/BB (2/2)','BB/C (2/4)','BB/CP (2/3)','C/C (4/4)','CP/C (3/4)','CP/CP (3/3)'],
        waterproofing: 'Підвищена',
        image: '/plywood/fsf.png',
        priceBase: 2300,
        pricePerMm: 210,
    },
    {
        type: 'ФК',
        thicknesses: [3,4,5,5.5,6,6.5,7,8,9,10,12,15,16,18,21,22,24,27,30],
        formats: ['1525x1525','2500x1250'],
        grades: ['B/B (1/1)','B/BB (1/2)','BB/BB (2/2)','BB/C (2/4)','BB/CP (2/3)','C/C (4/4)','CP/C (3/4)','CP/CP (3/3)'],
        waterproofing: 'Вологостійка',
        image: '/plywood/fk.png',
        priceBase: 1400,
        pricePerMm: 120,
    },
    {
        type: 'ФКМ',
        thicknesses: [4,6,7,10,12,15,18,21,24,27],
        formats: ['2500x1250'],
        grades: ['BB/BB (2/2)','BB/C (2/4)','BB/CP (2/3)','CP/C (3/4)','CP/CP (3/3)'],
        waterproofing: 'Підвищена',
        image: '/plywood/fkm.png',
        priceBase: 1600,
        pricePerMm: 140,
    },
    {
        type: 'Ламінована',
        thicknesses: [6,6.5,9,9.5,12,15,18,21,24,27,30,35,40],
        formats: ['2500x1250','3000x1500'],
        grades: [], // без сорту
        waterproofing: 'Водостійка',
        image: '/plywood/laminated.png',
        priceBase: 2500,
        pricePerMm: 220,
    },
    {
        type: 'Для Лазера',
        thicknesses: [3,4,5,6,8,10,12,15],
        formats: ['900x600','1525x1525','2500x1250'],
        grades: ['B/B (1/1)','B/BB (1/2)','BB/BB (2/2)'],
        waterproofing: 'Вологостійка',
        image: '/plywood/laser.png',
        priceBase: 1200,
        pricePerMm: 100,
    },
    {
        type: 'Транспортна',
        thicknesses: [12,15,18,21,24,27,30,35,40],
        formats: ['2500x1250','3000x1500'],
        grades: [], // без сорту
        waterproofing: 'Водостійка',
        image: '/plywood/transport.png',
        priceBase: 2700,
        pricePerMm: 230,
    },
    {
        type: 'Для Опалубки',
        thicknesses: [12,15,18,21,24,27,30,35,40],
        formats: ['2500x1250','3000x1500'],
        grades: ['гладка/гладка (F/F)'],
        waterproofing: 'Водостійка',
        image: '/plywood/formwork.png',
        priceBase: 2600,
        pricePerMm: 225,
    },
]

// формула ціни
const priceFor = (cfg: Catalog, t: number, f: string) =>
    Math.round((cfg.priceBase + cfg.pricePerMm * t) * (f === '3000x1500' ? 1.15 : 1))

// генератор: БЕЗ null — підставляємо '' коли сорту немає
function* generateAll(): Generator<Prisma.PlywoodProductCreateManyInput> {
    for (const cfg of CATALOG) {
        for (const t of cfg.thicknesses) {
            for (const f of cfg.formats) {
                const grades: string[] = cfg.grades.length > 0 ? cfg.grades : [''] // ← тільки string
                for (const g of grades) {
                    yield {
                        type: cfg.type,
                        thickness: t,
                        format: f,
                        grade: g, // '' для ламінованої/транспортної
                        manufacturer: 'Україна',
                        waterproofing: cfg.waterproofing,
                        price: priceFor(cfg, t, f),
                        image: cfg.image,
                        inStock: true,
                    }
                }
            }
        }
    }
}

async function main() {
    // 0) Чистимо записи з неправильним виробником
    const toDelete = await prisma.plywoodProduct.count({
        where: { manufacturer: { notIn: ['Україна'] } },
    })
    if (toDelete > 0) {
        await prisma.plywoodProduct.deleteMany({
            where: { manufacturer: { notIn: ['Україна'] } },
        })
    }
    console.log(`🧹 Видалено записів з чужим виробником: ${toDelete}`)

    // 1) Перейменування, якщо лишилися старі назви
    const rename: Record<string, string> = {
        'Фанера для Лазера': 'Для Лазера',
        'Фанера Транспортна': 'Транспортна',
        'Фанера для Опалубки': 'Для Опалубки',
    }
    for (const [from, to] of Object.entries(rename)) {
        const res = await prisma.plywoodProduct.updateMany({ where: { type: from }, data: { type: to } })
        if (res.count > 0) console.log(`✏️ Перейменовано "${from}" → "${to}": ${res.count}`)
    }

    // 2) Жорстко видаляємо ВСІ старі Ламіновані та Транспортні (з будь-яким grade)
    const wiped = await prisma.plywoodProduct.deleteMany({
        where: { type: { in: ['Ламінована', 'Транспортна'] } },
    })
    console.log(`🗑️ Видалено Ламінована/Транспортна: ${wiped.count}`)

    // 3) Upsert усіх комбінацій
    let created = 0, updated = 0
    for (const d of generateAll()) {
        // Унікальний пошук (grade тепер завжди string)
        const existing = await prisma.plywoodProduct.findFirst({
            where: {
                type: d.type,
                thickness: d.thickness,
                format: d.format,
                grade: d.grade,                // '' для безсортових
                manufacturer: d.manufacturer,
            },
            select: { id: true },
        })

        if (existing) {
            await prisma.plywoodProduct.update({ where: { id: existing.id }, data: d })
            updated++
        } else {
            await prisma.plywoodProduct.create({ data: d })
            created++
        }
    }

    const total = await prisma.plywoodProduct.count()
    console.log(`🌱 Seed OK · created: ${created} · updated: ${updated} · total now: ${total}`)
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())

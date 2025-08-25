// app/api/recommend/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type RecommendBody = Partial<{
    type: string | string[]
    thickness: number | string | (number | string)[]
    format: string | string[]
    grade: string | string[]
    manufacturer: string | string[]
    waterproofing: string | string[]
    limit: number
}>

const toStrList = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean)
    if (v == null) return []
    const s = String(v).trim()
    return s ? [s] : []
}
const toNumList = (v: unknown): number[] => {
    const src = Array.isArray(v) ? v : v == null ? [] : [v]
    return src.map(x => Number(String(x))).filter(n => Number.isFinite(n))
}

const parseLimit = (req: NextRequest, bodyLimit?: unknown, fallback = 12) => {
    const q = req.nextUrl.searchParams.get('limit')
    const cands = [q, bodyLimit, fallback]
    for (const c of cands) {
        const n = typeof c === 'number' ? c : Number(c)
        if (Number.isFinite(n) && n > 0 && n <= 100) return Math.floor(n)
    }
    return fallback
}

// без 'mode': просто відсіюємо популярні варіанти написання
const bannedTypeFilter: Prisma.PlywoodProductWhereInput = {
    NOT: [
        { type: { contains: 'мебл' } }, // «меблева»
        { type: { in: ['ФКМ', 'фкм', 'Фкм'] } },
    ],
}

// ---------- GET ----------
export async function GET(req: NextRequest) {
    try {
        const take = parseLimit(req, undefined, 12)
        const products = await prisma.plywoodProduct.findMany({
            where: bannedTypeFilter,
            orderBy: [{ price: 'asc' }, { id: 'asc' }],
            take,
        })
        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error('GET /api/recommend error:', err)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

// ---------- POST (мультивибір) ----------
export async function POST(req: NextRequest) {
    try {
        let raw: RecommendBody = {}
        try { raw = (await req.json()) as RecommendBody } catch {}

        const types          = toStrList(raw.type)
        const formats        = toStrList(raw.format)
        const grades         = toStrList(raw.grade)
        const manufacturers  = toStrList(raw.manufacturer)
        const waterproofings = toStrList(raw.waterproofing)
        const thicknesses    = toNumList(raw.thickness)

        const andFilters: Prisma.PlywoodProductWhereInput[] = [bannedTypeFilter]
        if (types.length)          andFilters.push({ type: { in: types } })
        if (formats.length)        andFilters.push({ format: { in: formats } })
        if (grades.length)         andFilters.push({ grade: { in: grades } })
        if (manufacturers.length)  andFilters.push({ manufacturer: { in: manufacturers } })
        if (waterproofings.length) andFilters.push({ waterproofing: { in: waterproofings } })
        if (thicknesses.length)    andFilters.push({ thickness: { in: thicknesses } })

        const where: Prisma.PlywoodProductWhereInput =
            andFilters.length ? { AND: andFilters } : {}

        const take = parseLimit(req, raw.limit, 24)

        const products = await prisma.plywoodProduct.findMany({
            where,
            orderBy: [{ price: 'asc' }, { id: 'asc' }],
            take,
        })

        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error('POST /api/recommend error:', err)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

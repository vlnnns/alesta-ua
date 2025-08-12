// app/api/recommend/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type RecommendBody = Partial<{
    type: string
    thickness: number | string
    format: string
    grade: string
    manufacturer: string
}>

// ---------- GET: "просто поради" без фільтрів ----------
export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams
        const limitRaw = sp.get('limit')
        const safeLimit =
            limitRaw && !Number.isNaN(Number(limitRaw))
                ? Math.min(Math.max(Number(limitRaw), 1), 48)
                : 8

        // тут своя логіка рекомендацій: найдешевші / нові / довільні
        const products = await prisma.plywoodProduct.findMany({
            orderBy: [{ price: 'asc' }, { id: 'asc' }],
            take: safeLimit,
        })

        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error('GET /api/recommend error:', err)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

// ---------- POST: з фільтрами з квізу ----------
export async function POST(req: NextRequest) {
    try {
        let raw: unknown = {}
        try {
            raw = await req.json()
        } catch {
            raw = {}
        }

        const { type, thickness: thicknessRaw, format, grade, manufacturer } =
            (typeof raw === 'object' && raw !== null ? raw : {}) as RecommendBody

        const parsedThickness =
            typeof thicknessRaw === 'number'
                ? thicknessRaw
                : typeof thicknessRaw === 'string' &&
                thicknessRaw.trim() !== '' &&
                !Number.isNaN(Number(thicknessRaw))
                    ? Number(thicknessRaw)
                    : undefined

        const where: Prisma.PlywoodProductWhereInput = {
            ...(type ? { type } : {}),
            ...(format ? { format } : {}),
            ...(grade ? { grade } : {}),
            ...(manufacturer ? { manufacturer } : {}),
            ...(parsedThickness !== undefined ? { thickness: parsedThickness } : {}),
        }

        const products = await prisma.plywoodProduct.findMany({
            where,
            orderBy: [{ price: 'asc' }, { id: 'asc' }],
            take: 48,
        })

        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error('POST /api/recommend error:', err)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

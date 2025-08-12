import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams

        const type = sp.get('type') ?? undefined
        const grade = sp.get('grade') ?? undefined
        const format = sp.get('format') ?? undefined
        const manufacturer = sp.get('manufacturer') ?? undefined

        const minThicknessRaw = sp.get('minThickness')
        const maxThicknessRaw = sp.get('maxThickness')
        const pageRaw = sp.get('page') ?? '1'
        const limitRaw = sp.get('limit') ?? '24'

        const minThickness =
            minThicknessRaw !== null && !Number.isNaN(Number(minThicknessRaw))
                ? Number(minThicknessRaw)
                : undefined

        const maxThickness =
            maxThicknessRaw !== null && !Number.isNaN(Number(maxThicknessRaw))
                ? Number(maxThicknessRaw)
                : undefined

        const page = Number.parseInt(pageRaw, 10)
        const limit = Number.parseInt(limitRaw, 10)
        const safePage = Number.isFinite(page) && page > 0 ? page : 1
        const safeLimit =
            Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 24

        const where: Prisma.PlywoodProductWhereInput = {
            ...(type ? { type } : {}),
            ...(grade ? { grade } : {}),
            ...(format ? { format } : {}),
            ...(manufacturer ? { manufacturer } : {}),
            ...(minThickness !== undefined || maxThickness !== undefined
                ? {
                    thickness: {
                        ...(minThickness !== undefined ? { gte: minThickness } : {}),
                        ...(maxThickness !== undefined ? { lte: maxThickness } : {}),
                    },
                }
                : {}),
        }

        const skip = (safePage - 1) * safeLimit

        const [items, total] = await Promise.all([
            prisma.plywoodProduct.findMany({
                where,
                orderBy: { id: 'asc' },
                skip,
                take: safeLimit,
            }),
            prisma.plywoodProduct.count({ where }),
        ])

        return NextResponse.json({
            items,
            page: safePage,
            limit: safeLimit,
            total,
            pages: Math.ceil(total / safeLimit),
        })
    } catch (err: unknown) {
        console.error('GET /api/products error:', err)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

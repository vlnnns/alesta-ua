// app/api/admin/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        // фільтри (необов’язкові)
        const type         = searchParams.get('type') ?? undefined
        const grade        = searchParams.get('grade') ?? undefined
        const format       = searchParams.get('format') ?? undefined
        const manufacturer = searchParams.get('manufacturer') ?? undefined

        const minThicknessRaw = searchParams.get('minThickness')
        const maxThicknessRaw = searchParams.get('maxThickness')

        const minThickness =
            minThicknessRaw !== null && !Number.isNaN(Number(minThicknessRaw))
                ? Number(minThicknessRaw)
                : undefined

        const maxThickness =
            maxThicknessRaw !== null && !Number.isNaN(Number(maxThicknessRaw))
                ? Number(maxThicknessRaw)
                : undefined

        // пагінація (за замовчуванням віддаємо «всі»)
        const page  = Math.max(1, Number(searchParams.get('page') ?? '1'))
        const limit = Math.min(100000, Math.max(1, Number(searchParams.get('limit') ?? '100000')))
        const skip  = (page - 1) * limit

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

        const [items, total] = await Promise.all([
            prisma.plywoodProduct.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { type: 'asc' },
                    { thickness: 'asc' },
                    { format: 'asc' },
                    { grade: 'asc' },
                    { id: 'asc' },
                ],
                select: {
                    id: true,
                    type: true,
                    thickness: true,
                    format: true,
                    grade: true,
                    manufacturer: true,
                    waterproofing: true,
                    price: true,
                    image: true,
                    inStock: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.plywoodProduct.count({ where }),
        ])

        return NextResponse.json({
            items,
            hasMore: skip + items.length < total,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        })
    } catch (e) {
        console.error('GET /api/admin/products error:', e)
        return NextResponse.json({ error: 'LIST_FETCH_FAILED' }, { status: 500 })
    }
}

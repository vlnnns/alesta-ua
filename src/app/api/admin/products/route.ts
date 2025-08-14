// src/app/api/admin/products/route.ts  (GET + POST)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ProductCreateSchema = z.object({
    type: z.string().min(1),
    thickness: z.number().positive(),
    format: z.string().min(1),
    grade: z.string().min(1),
    manufacturer: z.string().min(1),
    waterproofing: z.string().min(1),
    price: z.number().int().nonnegative(),
    image: z.string().min(1),
    inStock: z.boolean().optional().default(true),
})

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams
        const page = Math.max(1, Number(sp.get('page') ?? 1))
        const limit = Math.min(100, Math.max(1, Number(sp.get('limit') ?? 50)))
        const skip = (page - 1) * limit

        const [items, total] = await Promise.all([
            prisma.plywoodProduct.findMany({
                orderBy: { id: 'desc' },
                skip,
                take: limit,
            }),
            prisma.plywoodProduct.count(),
        ])

        return NextResponse.json({ items, page, limit, total })
    } catch (e: unknown) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const raw = await req.json()
        const parsed = ProductCreateSchema.parse(raw)

        const created = await prisma.plywoodProduct.create({ data: parsed })
        return NextResponse.json(created, { status: 201 })
    } catch (e: unknown) {
        if (e instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation error', details: e.flatten() }, { status: 400 })
        }
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

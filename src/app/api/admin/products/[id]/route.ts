// app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

type PatchBody = Partial<{
    type: string
    thickness: number
    format: string
    grade: string
    manufacturer: string
    waterproofing: string
    price: number
    image: string
    inStock: boolean
}>

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        if (!Number.isFinite(id)) return NextResponse.json({ error: 'BAD_ID' }, { status: 400 })

        let bodyJson: unknown
        try { bodyJson = await req.json() } catch { bodyJson = {} }
        const body = bodyJson as PatchBody

        const data: Prisma.PlywoodProductUpdateInput = {}

        if (typeof body.type === 'string') data.type = body.type.trim()
        if (typeof body.thickness === 'number') data.thickness = body.thickness
        if (typeof body.format === 'string') data.format = body.format.trim()
        if (typeof body.grade === 'string') data.grade = body.grade.trim()
        if (typeof body.manufacturer === 'string') data.manufacturer = body.manufacturer.trim()
        if (typeof body.waterproofing === 'string') data.waterproofing = body.waterproofing.trim()
        if (typeof body.price === 'number') data.price = Math.max(0, body.price)
        if (typeof body.image === 'string') data.image = body.image.trim()
        if (typeof body.inStock === 'boolean') data.inStock = body.inStock

        if ('thickness' in data && typeof data.thickness === 'number' && data.thickness <= 0) {
            return NextResponse.json({ error: 'BAD_THICKNESS' }, { status: 400 })
        }

        const updated = await prisma.plywoodProduct.update({
            where: { id },
            data,
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
        })

        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'PATCH_FAILED' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        if (!Number.isFinite(id)) return NextResponse.json({ error: 'BAD_ID' }, { status: 400 })
        await prisma.plywoodProduct.delete({ where: { id } })
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: 'DELETE_FAILED' }, { status: 500 })
    }
}

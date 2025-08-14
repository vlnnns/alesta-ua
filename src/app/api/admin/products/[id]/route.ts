// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ProductUpdateSchema = z.object({
    type: z.string().min(1).optional(),
    thickness: z.number().positive().optional(),
    format: z.string().min(1).optional(),
    grade: z.string().min(1).optional(),
    manufacturer: z.string().min(1).optional(),
    waterproofing: z.string().min(1).optional(),
    price: z.number().int().nonnegative().optional(),
    image: z.string().min(1).optional(),
    inStock: z.boolean().optional(),
})

// PATCH /api/admin/products/[id]
export async function PATCH(
    req: Request,
    { params }: { params: Record<string, string> }
) {
    try {
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'Bad id' }, { status: 400 })
        }

        const raw = await req.json()
        const data = ProductUpdateSchema.parse(raw)

        const updated = await prisma.plywoodProduct.update({
            where: { id },
            data,
        })
        return NextResponse.json(updated)
    } catch (e) {
        if (e instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: e.flatten() },
                { status: 400 }
            )
        }
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
    _req: Request,
    { params }: { params: Record<string, string> }
) {
    try {
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'Bad id' }, { status: 400 })
        }

        await prisma.plywoodProduct.delete({ where: { id } })
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

// app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

type PatchBody = Partial<{
    type: string
    thickness: number
    format: string
    grade: string | null      // из формы может прийти null/пусто — мы просто игнорируем
    manufacturer: string
    waterproofing: string
    price: number
    image: string | null      // из формы может прийти null — игнорируем
    inStock: boolean
}>

/** PATCH /api/admin/products/[id] */
export async function PATCH(
    req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const numId = Number(id)
        if (!Number.isFinite(numId)) {
            return NextResponse.json({ error: 'BAD_ID' }, { status: 400 })
        }

        let bodyJson: unknown
        try { bodyJson = await req.json() } catch { bodyJson = {} }
        const body = bodyJson as PatchBody

        const data: Prisma.PlywoodProductUpdateInput = {}

        if (typeof body.type === 'string') data.type = body.type.trim()
        if (typeof body.thickness === 'number') data.thickness = body.thickness
        if (typeof body.format === 'string') data.format = body.format.trim()

        // grade: НЕ присваиваем null, если поле non-nullable в Prisma
        if (Object.prototype.hasOwnProperty.call(body, 'grade')) {
            if (typeof body.grade === 'string') data.grade = body.grade.trim()
            // если пришёл null/пусто — ничего не делаем (оставляем как есть)
        }

        if (typeof body.manufacturer === 'string') data.manufacturer = body.manufacturer.trim()
        if (typeof body.waterproofing === 'string') data.waterproofing = body.waterproofing.trim()
        if (typeof body.price === 'number') data.price = Math.max(0, body.price)

        // image: НЕ присваиваем null (тип не допускает)
        if (Object.prototype.hasOwnProperty.call(body, 'image')) {
            if (typeof body.image === 'string') {
                const img = body.image.trim()
                if (img) data.image = img
                // пустую строку тоже не записываем, чтобы не словить ограничение NOT NULL
            }
        }

        if ('thickness' in data && typeof data.thickness === 'number' && data.thickness <= 0) {
            return NextResponse.json({ error: 'BAD_THICKNESS' }, { status: 400 })
        }

        const updated = await prisma.plywoodProduct.update({
            where: { id: numId },
            data,
            select: {
                id: true, type: true, thickness: true, format: true, grade: true,
                manufacturer: true, waterproofing: true, price: true, image: true,
                inStock: true, createdAt: true, updatedAt: true,
            },
        })

        return NextResponse.json(updated)
    } catch (e) {
        console.error('PATCH /api/admin/products/[id] error:', e)
        return NextResponse.json({ error: 'PATCH_FAILED' }, { status: 500 })
    }
}

/** DELETE /api/admin/products/[id] */
export async function DELETE(
    _req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const numId = Number(id)
        if (!Number.isFinite(numId)) {
            return NextResponse.json({ error: 'BAD_ID' }, { status: 400 })
        }

        await prisma.plywoodProduct.delete({ where: { id: numId } })
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('DELETE /api/admin/products/[id] error:', e)
        return NextResponse.json({ error: 'DELETE_FAILED' }, { status: 500 })
    }
}

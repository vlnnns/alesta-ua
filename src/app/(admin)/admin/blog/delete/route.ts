import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const body = await req.json() as {
            type: string
            thickness: number
            format: string
            grade?: string
            manufacturer: string
            waterproofing: string
            price: number
            inStock?: boolean
            image: string // ожидаем относительный путь, например "/uploads/xxxx.png"
        }

        // простая валидация
        const imagePath = String(body.image || '')
        if (!imagePath.startsWith('/uploads/')) {
            return NextResponse.json({ error: 'Некоректний шлях зображення' }, { status: 400 })
        }

        const created = await prisma.plywoodProduct.create({
            data: {
                type: body.type.trim(),
                thickness: Number(body.thickness),
                format: body.format.trim(),
                grade: (body.grade ?? '').trim() || null,
                manufacturer: body.manufacturer.trim(),
                waterproofing: body.waterproofing.trim(),
                price: Math.max(0, Number(body.price)),
                inStock: Boolean(body.inStock),
                image: imagePath,
            },
            select: { id: true },
        })

        return NextResponse.json({ id: created.id })
    } catch (e) {
        return NextResponse.json({ error: 'CREATE_FAILED' }, { status: 500 })
    }
}

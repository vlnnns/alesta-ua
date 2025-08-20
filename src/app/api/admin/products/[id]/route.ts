import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const toNum = (v: unknown) => {
    const n = Number(typeof v === 'string' ? v : '')
    return Number.isFinite(n) ? n : 0
}
const toBool = (v: unknown) => {
    if (typeof v === 'boolean') return v
    const s = String(v ?? '').toLowerCase()
    return s === 'on' || s === 'true' || s === '1'
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        if (!Number.isFinite(id)) return NextResponse.json({ error: 'Bad id' }, { status: 400 })

        const ct = req.headers.get('content-type') || ''
        let data: any = {}

        if (ct.includes('application/json')) {
            const b = await req.json()
            // быстрый путь для переключателя
            if ('inStock' in b && Object.keys(b).length === 1) data.inStock = !!b.inStock
            else {
                data = {
                    type: b.type?.trim() ?? undefined,
                    thickness: toNum(b.thickness),
                    format: b.format?.trim() ?? undefined,
                    grade: b.grade?.trim() ?? undefined,
                    manufacturer: b.manufacturer?.trim() ?? undefined,
                    waterproofing: b.waterproofing?.trim() ?? undefined,
                    price: toNum(b.price),
                    inStock: !!b.inStock,
                    image: b.image?.trim() || undefined,
                }
            }
        } else {
            const fd = await req.formData()
            data = {
                type: String(fd.get('type') ?? '').trim(),
                thickness: toNum(fd.get('thickness')),
                format: String(fd.get('format') ?? '').trim(),
                grade: String(fd.get('grade') ?? '').trim(),
                manufacturer: String(fd.get('manufacturer') ?? '').trim(),
                waterproofing: String(fd.get('waterproofing') ?? '').trim(),
                price: toNum(fd.get('price')),
                inStock: toBool(fd.get('inStock')),
            }

            // файл можно обработать здесь (S3/Cloudinary) и присвоить data.image = url
            // если приходит imageUrl с модалки — поддержим:
            const imageUrl = String(fd.get('imageUrl') ?? '').trim()
            if (imageUrl) data.image = imageUrl
        }

        const updated = await prisma.plywoodProduct.update({
            where: { id },
            data,
        })
        return NextResponse.json(updated)
    } catch (e) {
        console.error('PATCH /api/admin/products/[id] failed:', e)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        await prisma.plywoodProduct.delete({ where: { id } })
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('DELETE /api/admin/products/[id] failed:', e)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

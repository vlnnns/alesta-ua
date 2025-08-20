import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'           // важное. Не edge.
export const dynamic = 'force-dynamic'

function toNum(v: unknown) {
    const n = Number(typeof v === 'string' ? v.trim() : v)
    return Number.isFinite(n) ? n : 0
}
function toBool(v: unknown) {
    if (typeof v === 'boolean') return v
    const s = String(v ?? '').toLowerCase()
    return s === 'on' || s === 'true' || s === '1'
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'Bad id' }, { status: 400 })
        }

        const ct = req.headers.get('content-type') || ''
        let data: any = {}

        // 1) JSON (например, toggle inStock)
        if (ct.includes('application/json')) {
            const body = await req.json()

            // только inStock — быстрый путь
            if ('inStock' in body && Object.keys(body).length === 1) {
                data.inStock = !!body.inStock
            } else {
                data = {
                    type: body.type?.trim() ?? undefined,
                    thickness: toNum(body.thickness),
                    format: body.format?.trim() ?? undefined,
                    grade: body.grade?.trim() ?? undefined,
                    manufacturer: body.manufacturer?.trim() ?? undefined,
                    waterproofing: body.waterproofing?.trim() ?? undefined,
                    price: toNum(body.price),
                    image: body.image ? String(body.image) : undefined,
                    inStock: !!body.inStock,
                }
            }
        }
        // 2) multipart/form-data (когда редактируете карточку с FormData)
        else {
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

            // если грузите URL вместо файла
            const imageUrl = String(fd.get('imageUrl') ?? '').trim()
            if (imageUrl) data.image = imageUrl

            // если придёт файл — тут загрузите его в S3/Cloudinary и запишите URL:
            // const file = fd.get('imageFile') as File | null
            // if (file && file.size > 0) { const url = await upload(file); data.image = url }
        }

        const updated = await prisma.plywoodProduct.update({
            where: { id },
            data,
        })
        return NextResponse.json(updated)
    } catch (e) {
        console.error('PATCH /api/admin/products/[id] failed:', e)
        return NextResponse.json({ error: 'Save failed' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        await prisma.plywoodProduct.delete({ where: { id } })
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('DELETE /api/admin/products/[id] failed:', e)
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}

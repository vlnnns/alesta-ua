// app/api/admin/products/by-type/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        let type = (searchParams.get('type') ?? '').trim()

        if (!type) {
            // дозволимо також передавати в JSON-тілі
            let body: unknown
            try { body = await req.json() } catch { body = {} }
            const t = (body as { type?: string }).type
            if (typeof t === 'string') type = t.trim()
        }

        if (!type) {
            return NextResponse.json({ error: 'TYPE_REQUIRED' }, { status: 400 })
        }

        const result = await prisma.plywoodProduct.deleteMany({ where: { type } })
        return NextResponse.json({ ok: true, deleted: result.count })
    } catch (e) {
        console.error('DELETE /api/admin/products/by-type error:', e)
        return NextResponse.json({ error: 'DELETE_TYPE_FAILED' }, { status: 500 })
    }
}

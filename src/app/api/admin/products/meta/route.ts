// app/api/admin/products/meta/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const isDefined = <T,>(v: T | null | undefined): v is T => v !== null && v !== undefined
const isNonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim().length > 0
const uniq = <T,>(arr: (T | null | undefined)[]) => Array.from(new Set(arr.filter(isDefined)))


export async function GET() {
    try {
        const rows = await prisma.plywoodProduct.findMany({
            select: {
                type: true,
                thickness: true,
                format: true,
                grade: true,
                manufacturer: true,
                waterproofing: true,
            },
        })

        const types         = uniq(rows.map(r => r.type)).filter(isNonEmpty).sort((a, b) => a.localeCompare(b, 'uk'))
        const thicknesses   = uniq(rows.map(r => r.thickness)).sort((a, b) => Number(a) - Number(b))
        const formats       = uniq(rows.map(r => r.format)).filter(isNonEmpty).sort((a, b) => a.localeCompare(b, 'uk'))
        const grades        = uniq(rows.map(r => r.grade)).filter(isNonEmpty).sort((a, b) => a.localeCompare(b, 'uk'))
        const manufacturers = uniq(rows.map(r => r.manufacturer)).filter(isNonEmpty).sort((a, b) => a.localeCompare(b, 'uk'))
        const waters        = uniq(rows.map(r => r.waterproofing)).filter(isNonEmpty).sort((a, b) => a.localeCompare(b, 'uk'))

        return NextResponse.json({ types, thicknesses, formats, grades, manufacturers, waters })
    } catch {
        return NextResponse.json({ error: 'META_FETCH_FAILED' }, { status: 500 })
    }
}

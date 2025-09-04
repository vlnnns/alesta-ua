// app/api/admin/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

/* ---------------- helpers ---------------- */
type CreateBody = {
    type: string
    thickness: number
    format: string
    grade: string | null
    manufacturer: string
    waterproofing: string
    price: number
    inStock?: boolean
    image: string            // ожидаем относительный путь /uploads/...
    force?: boolean          // разрешить сохранение дубля
}

function trimOrNull(v: unknown): string | null {
    if (typeof v !== 'string') return null
    const t = v.trim()
    return t.length ? t : null
}
function toNumber(v: unknown): number | null {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
}
function isValidUploadsPath(p: unknown): p is string {
    return typeof p === 'string' && p.startsWith('/uploads/')
}

/* ================= GET ================= */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        // фильтры
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

        // пагинация (по умолчанию — «все»)
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

/* ================= POST ================= */
/**
 * Ждём JSON:
 * {
 *   type, thickness, format, grade, manufacturer,
 *   waterproofing, price, inStock?, image: "/uploads/...",
 *   force?: true // чтобы создавать дубликат с новым id
 * }
 * Ответы:
 *   201 { id }
 *   409 { error: 'DUPLICATE', existingId? }
 *   400 { error: 'VALIDATION', details }
 */
export async function POST(req: Request) {
    try {
        const b = (await req.json().catch(() => ({}))) as Partial<CreateBody>

        const type          = trimOrNull(b?.type ?? null)
        const format        = trimOrNull(b?.format ?? null)
        const grade         = trimOrNull(b?.grade ?? null) // может быть null
        const manufacturer  = trimOrNull(b?.manufacturer ?? null)
        const waterproofing = trimOrNull(b?.waterproofing ?? null)
        const image         = b?.image
        const thickness     = toNumber(b?.thickness)
        const price         = toNumber(b?.price)
        const inStock       = Boolean(b?.inStock)
        const force         = Boolean(b?.force)

        // валидация
        if (!type || !format || !manufacturer || !waterproofing) {
            return NextResponse.json(
                { error: 'VALIDATION', details: 'Missing required fields' },
                { status: 400 },
            )
        }
        if (thickness === null || thickness <= 0) {
            return NextResponse.json(
                { error: 'VALIDATION', details: 'Bad thickness' },
                { status: 400 },
            )
        }
        if (price === null || price < 0) {
            return NextResponse.json(
                { error: 'VALIDATION', details: 'Bad price' },
                { status: 400 },
            )
        }
        if (!isValidUploadsPath(image)) {
            return NextResponse.json(
                { error: 'VALIDATION', details: 'Invalid image path' },
                { status: 400 },
            )
        }

        // проверка дубля по ключу
        const existing = await prisma.plywoodProduct.findFirst({
            where: {
                type,
                thickness,
                format,
                manufacturer,
                ...(grade === null ? { grade: null } : { grade }),
            },
            select: { id: true },
        })

        if (existing && !force) {
            return NextResponse.json(
                { error: 'DUPLICATE', existingId: existing.id },
                { status: 409 },
            )
        }

        // если existing && force === true — просто создаём ещё одну запись
        const created = await prisma.plywoodProduct.create({
            data: {
                type,
                thickness,
                format,
                grade,
                manufacturer,
                waterproofing,
                price,
                image,
                inStock,
            },
            select: { id: true },
        })

        return NextResponse.json({ id: created.id }, { status: 201 })
    } catch (e: unknown) {
        // Если в БД оставлен компаунд-UNIQUE, Prisma кинет P2002 — вернём как дубль
        if (typeof e === 'object' && e !== null && (e as { code?: string }).code === 'P2002') {
            return NextResponse.json({ error: 'DUPLICATE' }, { status: 409 })
        }
        console.error('POST /api/admin/products error:', e)
        return NextResponse.json({ error: 'CREATE_FAILED' }, { status: 500 })
    }
}

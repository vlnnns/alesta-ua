'use server'

import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

type CreateOK = { ok: true; id: number }
type CreateErr = { ok: false; error: string; code?: 'ALREADY_EXISTS'; existingId?: number }
export type CreateResult = CreateOK | CreateErr

// з варіантом B: у БД зберігаємо відносний шлях /uploads/...
const schema = z.object({
    type: z.string().min(1, 'Вкажіть тип'),
    thickness: z.number().positive('Товщина має бути > 0'),
    format: z.string().min(1, 'Вкажіть формат'),
    grade: z.string().min(1, 'Вкажіть сорт'),
    manufacturer: z.string().min(1, 'Вкажіть виробника'),
    waterproofing: z.string().min(1, 'Вкажіть клей/вологостійкість'),
    price: z.number().int().min(0, 'Ціна не може бути від’ємною'),
    inStock: z.boolean().optional().default(false),
    image: z.string().regex(/^\/uploads\/[A-Za-z0-9._-]+$/, 'Некоректний шлях зображення'),
})

export async function createProduct(data: unknown): Promise<CreateResult> {
    try {
        const parsed = schema.parse(data)

        // Попередня перевірка на дублікат (за компаунд-уніком)
        const dup = await prisma.plywoodProduct.findFirst({
            where: {
                type: parsed.type,
                thickness: parsed.thickness,
                format: parsed.format,
                grade: parsed.grade,
                manufacturer: parsed.manufacturer,
            },
            select: { id: true },
        })
        if (dup) {
            return { ok: false, code: 'ALREADY_EXISTS', existingId: dup.id, error: 'Така позиція вже існує' }
        }

        const created = await prisma.plywoodProduct.create({
            data: parsed,
            select: { id: true },
        })

        revalidatePath('/admin/products')
        return { ok: true, id: created.id }
    } catch (e) {
        // На випадок гонки: унікальний індекс
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
            const s = schema.safeParse(data)
            if (s.success) {
                const dup = await prisma.plywoodProduct.findFirst({
                    where: {
                        type: s.data.type,
                        thickness: s.data.thickness,
                        format: s.data.format,
                        grade: s.data.grade,
                        manufacturer: s.data.manufacturer,
                    },
                    select: { id: true },
                })
                return { ok: false, code: 'ALREADY_EXISTS', existingId: dup?.id, error: 'Така позиція вже існує' }
            }
            return { ok: false, error: 'Така позиція вже існує' }
        }

        if (e instanceof ZodError) return { ok: false, error: e.issues.map(i => i.message).join('; ') }
        if (e instanceof Error) return { ok: false, error: e.message }
        return { ok: false, error: 'Server error' }
    }
}

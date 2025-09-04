// app/admin/products/new/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'
import { revalidatePath } from 'next/cache'

type CreateResult = { ok: true; id: number } | { ok: false; error: string }

const schema = z.object({
    type: z.string().min(1, 'Вкажіть тип'),
    thickness: z.number().positive('Товщина має бути > 0'),
    format: z.string().min(1, 'Вкажіть формат'),
    grade: z.string().min(1, 'Вкажіть сорт'),
    manufacturer: z.string().min(1, 'Вкажіть виробника'),
    waterproofing: z.string().min(1, 'Вкажіть клей/вологостійкість'),
    price: z.number().int().min(0, 'Ціна не може бути від’ємною'),
    inStock: z.boolean().optional().default(false),
    // зберігаємо /uploads/..., який віддасть твій [...slug] роут
    image: z.string().regex(/^\/uploads\/[A-Za-z0-9._-]+$/, 'Некоректний шлях зображення'),
})

export async function createProduct(data: unknown): Promise<CreateResult> {
    try {
        const parsed = schema.parse(data)

        const created = await prisma.plywoodProduct.create({
            data: parsed,
            select: { id: true },
        })

        revalidatePath('/admin/products')
        return { ok: true, id: created.id }
    } catch (e) {
        if (e instanceof ZodError) return { ok: false, error: e.issues.map(i => i.message).join('; ') }
        if (e instanceof Error) return { ok: false, error: e.message }
        return { ok: false, error: 'Validation error' }
    }
}

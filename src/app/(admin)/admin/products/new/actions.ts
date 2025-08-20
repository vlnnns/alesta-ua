'use server'

import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'
import { revalidatePath } from 'next/cache'

type CreateResult =
    | { ok: true; id: number }
    | { ok: false; error: string }

const baseSchema = z.object({
    type: z.string().min(1, 'Вкажіть тип'),
    thickness: z.coerce.number().positive('Товщина має бути > 0'),
    format: z.string().min(1, 'Вкажіть формат'),
    grade: z.string().min(1, 'Вкажіть сорт'),
    manufacturer: z.string().min(1, 'Вкажіть виробника'),
    waterproofing: z.string().min(1, 'Вкажіть клей/вологостійкість'),
    // вместо deprecated nonnegative() используем min(0)
    price: z.coerce.number().int().min(0, 'Ціна не може бути від’ємною'),
    inStock: z.boolean().optional().default(false),
})
const imageUrlSchema = z.string().url('Некоректний URL').optional()

export async function createProduct(form: FormData): Promise<CreateResult> {
    try {
        // 1) парсим базові поля
        const parsed = baseSchema.parse({
            type: form.get('type'),
            thickness: form.get('thickness'),
            format: form.get('format'),
            grade: form.get('grade'),
            manufacturer: form.get('manufacturer'),
            waterproofing: form.get('waterproofing'),
            price: form.get('price'),
            inStock: form.get('inStock') === 'on',
        })

        // 2) image: берем URL, файл пока игнорируем (если нужен — загрузка в S3/Cloudinary)
        const rawUrl = (form.get('imageUrl') as string | null)?.trim() || ''
        const image = rawUrl ? imageUrlSchema.parse(rawUrl) : undefined

        const created = await prisma.plywoodProduct.create({
            data: {
                type: parsed.type,
                thickness: parsed.thickness,
                format: parsed.format,
                grade: parsed.grade,
                manufacturer: parsed.manufacturer,
                waterproofing: parsed.waterproofing,
                price: parsed.price,
                inStock: parsed.inStock ?? false,
                image: image ?? '', // плейсхолдер, щоб не падало
            },
            select: { id: true },
        })

        revalidatePath('/admin/products')
        return { ok: true, id: created.id }
    } catch (e: unknown) {
        // аккуратное сужение типов
        if (e instanceof ZodError) {
            const msg = e.issues.map(i => i.message).join('; ')
            return { ok: false, error: msg }
        }
        if (e instanceof Error) {
            return { ok: false, error: e.message }
        }
        return { ok: false, error: 'Validation error' }
    }
}

'use server'

import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'
import { revalidatePath } from 'next/cache'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

type CreateResult = { ok: true; id: number } | { ok: false; error: string }

const schema = z.object({
    type: z.string().min(1, 'Вкажіть тип'),
    thickness: z.coerce.number().positive('Товщина має бути > 0'),
    format: z.string().min(1, 'Вкажіть формат'),
    grade: z.string().min(1, 'Вкажіть сорт'),
    manufacturer: z.string().min(1, 'Вкажіть виробника'),
    waterproofing: z.string().min(1, 'Вкажіть клей/вологостійкість'),
    price: z.coerce.number().int().min(0, 'Ціна не може бути від’ємною'),
    inStock: z.boolean().optional().default(false),
})

export async function createProduct(form: FormData): Promise<CreateResult> {
    try {
        const parsed = schema.parse({
            type: form.get('type'),
            thickness: form.get('thickness'),
            format: form.get('format'),
            grade: form.get('grade'),
            manufacturer: form.get('manufacturer'),
            waterproofing: form.get('waterproofing'),
            price: form.get('price'),
            inStock: form.get('inStock') === 'on',
        })

        const file = form.get('imageFile') as File | null
        if (!file || file.size === 0) {
            return { ok: false, error: 'Файл зображення обовʼязковий' }
        }

        // сохраняем файл на диск: /public/uploads/...
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadsDir, { recursive: true })

        const ext = (file.type.split('/')[1] || 'bin').toLowerCase()
        const name = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`
        const filePath = path.join(uploadsDir, name)
        const buffer = Buffer.from(await file.arrayBuffer())
        await fs.writeFile(filePath, buffer, { mode: 0o644 })
        const imageUrl = `/uploads/${name}`

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
                image: imageUrl,
            },
            select: { id: true },
        })

        revalidatePath('/admin/products')
        return { ok: true, id: created.id }
    } catch (e: unknown) {
        if (e instanceof ZodError) return { ok: false, error: e.issues.map(i => i.message).join('; ') }
        if (e instanceof Error) return { ok: false, error: e.message }
        return { ok: false, error: 'Validation error' }
    }
}

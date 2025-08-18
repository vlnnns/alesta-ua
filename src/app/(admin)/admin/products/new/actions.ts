'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({
    type: z.string().min(1),
    thickness: z.coerce.number().positive(),
    format: z.string().min(1),
    grade: z.string().min(1),
    manufacturer: z.string().min(1),
    waterproofing: z.string().min(1),
    price: z.coerce.number().int().nonnegative(),
    image: z.string().min(1),
    inStock: z.coerce.boolean().optional().default(false),
})

export async function createProduct(form: FormData) {
    try {
        const data = schema.parse({
            type: form.get('type'),
            thickness: form.get('thickness'),
            format: form.get('format'),
            grade: form.get('grade'),
            manufacturer: form.get('manufacturer'),
            waterproofing: form.get('waterproofing'),
            price: form.get('price'),
            image: form.get('image'),
            inStock: form.get('inStock') === 'on',
        })

        await prisma.plywoodProduct.create({ data })
        revalidatePath('/admin/products')
        return { ok: true as const }
    } catch (e: any) {
        return { ok: false as const, error: e?.message ?? 'Validation error' }
    }
}

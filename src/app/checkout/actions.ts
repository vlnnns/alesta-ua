'use server'

import { prisma } from '@/lib/prisma'

export type CheckoutItem = {
    id: number
    title: string
    image?: string
    price: number
    quantity: number
    type?: string
    thickness?: number
    format?: string
    grade?: string
    manufacturer?: string
    waterproofing?: string
}

export type CheckoutPayload = {
    customerName: string
    email: string
    phone: string
    city: string
    address?: string
    warehouse?: string
    comment?: string
    companyName?: string
    companyCode?: string
    items: CheckoutItem[]
    total: number
}

export async function submitOrder(payload: CheckoutPayload) {
    if (!payload.items?.length) {
        return { ok: false as const, error: 'Кошик порожній' }
    }
    if (!payload.customerName || !payload.email || !payload.phone || !payload.city) {
        return { ok: false as const, error: 'Заповніть обов’язкові поля' }
    }

    const order = await prisma.order.create({
        data: {
            customerName: payload.customerName,
            email: payload.email,
            phone: payload.phone,
            city: payload.city,
            address: payload.address ?? null,
            warehouse: payload.warehouse ?? null,
            comment: payload.comment ?? null,
            companyName: payload.companyName ?? null,
            companyCode: payload.companyCode ?? null,
            total: Math.max(0, Math.floor(payload.total)),
            items: {
                create: payload.items.map((it) => ({
                    productId: it.id,
                    title: it.title,
                    image: it.image ?? null,
                    price: Math.floor(it.price),
                    quantity: Math.max(1, Math.floor(it.quantity)),
                    type: it.type ?? null,
                    thickness: it.thickness ?? null,
                    format: it.format ?? null,
                    grade: it.grade ?? null,
                    manufacturer: it.manufacturer ?? null,
                    waterproofing: it.waterproofing ?? null,
                })),
            },
        },
        include: { items: true },
    })

    return { ok: true as const, id: order.id }
}

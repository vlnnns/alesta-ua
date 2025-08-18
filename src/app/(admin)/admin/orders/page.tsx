import { prisma } from '@/lib/prisma'
import OrdersTable from './OrdersTable'

export const revalidate = 0

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { id: 'desc' },
        include: { items: true },
        take: 200,
    })

    // серіалізуємо дати для клієнта
    const safeOrders = orders.map((o) => ({
        ...o,
        createdAt: o.createdAt?.toISOString?.() ?? null,
        updatedAt: o.updatedAt?.toISOString?.() ?? null,
    }))

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl font-semibold">Замовлення</h1>
                <OrdersTable orders={safeOrders} />
            </div>
        </main>
    )
}

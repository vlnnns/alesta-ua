import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

function fmtDate(d: Date | string | null) {
    if (!d) return '—'
    const dt = typeof d === 'string' ? new Date(d) : d
    return new Intl.DateTimeFormat('uk-UA', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(dt)
}
function fmtUAH(n: number) { return new Intl.NumberFormat('uk-UA').format(n) }

export default async function AdminHome() {
    const now = new Date()
    const from7 = new Date(now); from7.setDate(from7.getDate() - 7)

    const [productCount, orderCount, latestOrders, last7] = await Promise.all([
        prisma.plywoodProduct.count(),
        prisma.order.count(),
        prisma.order.findMany({
            orderBy: { id: 'desc' },
            select: { id: true, createdAt: true, customerName: true, total: true },
            take: 5,
        }),
        prisma.order.findMany({
            where: { createdAt: { gte: from7 } },
            select: { total: true },
        }),
    ])

    const orders7 = last7.length
    const revenue7 = last7.reduce((s, o) => s + o.total, 0)
    const avgCheck7 = orders7 ? Math.round(revenue7 / orders7) : 0

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Адмін-панель</h1>
                        <p className="mt-1 text-neutral-600">Оберіть дію: керування товарами або перегляд замовлень.</p>
                    </div>
                    <a href="/admin/logout" className="rounded-xl border px-3 py-2 text-sm">Вийти</a>


                </header>

                {/* Основні дії */}
                <section className="grid gap-6 sm:grid-cols-2">
                    {/* Товари */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Товари</h2>
                                <p className="mt-1 text-sm text-neutral-600">Керування асортиментом, цінами, наявністю.</p>
                            </div>
                            <svg className="h-8 w-8 text-neutral-400" viewBox="0 0 24 24" fill="none">
                                <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-neutral-600">
                                Всього позицій: <span className="font-medium text-neutral-900">{productCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href="/admin/products"
                                      className="rounded-xl bg-[#D08B4C] px-4 py-2 text-white hover:bg-[#c57b37]">
                                    Перейти до товарів
                                </Link>
                                <Link href="/admin/products/new"
                                      className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50">
                                    + Додати товар
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Замовлення */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Замовлення</h2>
                                <p className="mt-1 text-sm text-neutral-600">Перегляд і обробка замовлень клієнтів.</p>
                            </div>
                            <svg className="h-8 w-8 text-neutral-400" viewBox="0 0 24 24" fill="none">
                                <path d="M6 7h12l1 12H5L6 7z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-neutral-600">
                                Всього замовлень: <span className="font-medium text-neutral-900">{orderCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href="/admin/orders"
                                      className="rounded-xl bg-[#D08B4C] px-4 py-2 text-white hover:bg-[#c57b37]">
                                    Перейти до замовлень
                                </Link>
                                <Link href="/admin/orders/export?range=30d"
                                      className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50">
                                    Експорт CSV (30 днів)
                                </Link>
                                <Link href="/admin/orders/export?range=7d"
                                      className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50">
                                    Експорт CSV (7 днів)
                                </Link>
                            </div>
                        </div>

                        {/* Метрики за 7 днів */}
                        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-xl bg-neutral-50 p-3">
                                <div className="text-xs text-neutral-500">Замовлень (7 днів)</div>
                                <div className="text-lg font-semibold">{orders7}</div>
                            </div>
                            <div className="rounded-xl bg-neutral-50 p-3">
                                <div className="text-xs text-neutral-500">Виручка (7 днів)</div>
                                <div className="text-lg font-semibold">₴{fmtUAH(revenue7)}</div>
                            </div>
                            <div className="rounded-xl bg-neutral-50 p-3">
                                <div className="text-xs text-neutral-500">Середній чек</div>
                                <div className="text-lg font-semibold">₴{fmtUAH(avgCheck7)}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Останні замовлення */}
                <section className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                        <h3 className="text-lg font-semibold">Останні замовлення</h3>
                        <Link href="/admin/orders" className="text-[#D08B4C] text-sm hover:underline">Всі замовлення →</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-neutral-50 text-neutral-600">
                            <tr>
                                <th className="px-4 py-3 text-left">№</th>
                                <th className="px-4 py-3 text-left">Дата</th>
                                <th className="px-4 py-3 text-left">Клієнт</th>
                                <th className="px-4 py-3 text-right">Сума</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                            {latestOrders.map((o) => (
                                <tr key={o.id}>
                                    <td className="px-4 py-3">#{o.id}</td>
                                    <td className="px-4 py-3">{fmtDate(o.createdAt)}</td>
                                    <td className="px-4 py-3">{o.customerName}</td>
                                    <td className="px-4 py-3 text-right">₴{fmtUAH(o.total)}</td>
                                </tr>
                            ))}
                            {!latestOrders.length && (
                                <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-500">Поки що немає замовлень</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    )
}

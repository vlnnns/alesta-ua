'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOrder, type CheckoutPayload } from './actions'
import { useCart } from '@/components/cart/CartProvider'
import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, subtotal, clearCart } = useCart()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        customerName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        warehouse: '',
        comment: '',
        companyName: '',
        companyCode: '',
    })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // перетворюємо id у number і валідимо
        const itemsPayload = items.map(it => {
            const productId = Number(it.productId)
            if (!Number.isFinite(productId)) {
                throw new Error('Bad productId in cart')
            }
            return {
                id: productId, // то, что ждёт бекенд
                title: it.title,
                image: it.image,
                price: it.price,
                quantity: it.quantity,
                type: it.type,
                thickness: it.thickness,
                format: it.format,
                grade: it.grade,
                manufacturer: it.manufacturer,
                waterproofing: it.waterproofing,
            }
        })


        const payload: CheckoutPayload = {
            ...form,
            items: itemsPayload,
            total: subtotal,
        }

        const res = await submitOrder(payload)
        setLoading(false)

        if (!res.ok) {
            setError(res.error ?? 'Не вдалося оформити замовлення.')
            return
        }

        clearCart()
        router.push(`/checkout/success?id=${res.id}`)
    }

    const label = 'block text-sm text-neutral-600 mb-1'
    const input =
        'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]'

    return (
        <main className="px-4 sm:px-6 py-10 mt-12 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl sm:text-4xl font-semibold tracking-tight">Оформлення замовлення</h1>

                {!items.length ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-600">
                        Кошик порожній.{' '}
                        <Link href="/catalog" className="text-[#D08B4C] font-medium hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-12">
                        {/* Form */}
                        <section className="md:col-span-8 space-y-6">
                            {/* Контакти */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <h2 className="mb-4 text-lg font-semibold">Контактні дані</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className={label}>
                                        Ім’я та прізвище *
                                        <input
                                            className={input}
                                            value={form.customerName}
                                            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                            required
                                        />
                                    </label>
                                    <label className={label}>
                                        Телефон *
                                        <input
                                            type="tel"
                                            className={input}
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+380..."
                                            required
                                        />
                                    </label>
                                    <label className={label}>
                                        Email *
                                        <input
                                            type="email"
                                            className={input}
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </label>

                                    {/* Місто (обов’язково — потрібно на сервері) */}
                                    <label className={label}>
                                        Місто *
                                        <input
                                            className={input}
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Коментар / Додатково */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <label className="block">
                                    <span className={label}>Коментар до замовлення</span>
                                    <textarea
                                        className={input}
                                        rows={3}
                                        value={form.comment}
                                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                    />
                                </label>
                            </div>


                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-[#D08B4C] px-5 py-3 text-white hover:bg-[#c57b37] disabled:opacity-60"
                                >
                                    {loading ? 'Оформляємо…' : 'Підтвердити замовлення'}
                                </button>
                                <Link href="/cart" className="text-[#D08B4C] hover:underline">
                                    Повернутись до кошика
                                </Link>
                            </div>
                        </section>

                        {/* Summary */}
                        <aside className="md:col-span-4">
                            <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-5">
                                <h2 className="mb-4 text-lg font-semibold">Ваше замовлення</h2>
                                <ul className="divide-y divide-neutral-200">
                                    {items.map((it) => (
                                        <li key={`${it.id}-${it.format}`} className="flex items-start gap-3 py-3">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                                                <Image src={it.image} alt={it.title} fill className="object-contain" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-medium">{it.title}</div>
                                                <div className="text-xs text-neutral-600">×{it.quantity}</div>
                                            </div>
                                            <div className="text-sm font-semibold">₴{it.price * it.quantity}</div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="my-4 h-px bg-neutral-200" />
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-600">Разом</span>
                                    <span className="text-xl font-semibold">₴{subtotal}</span>
                                </div>
                            </div>
                        </aside>
                    </form>
                )}
            </div>
        </main>
    )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'

export default function CartPageClient() {
    const { items, subtotal, updateQty, removeItem, clearCart } = useCart()

    const hasItems = items.length > 0

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl sm:text-4xl font-semibold tracking-tight">Кошик</h1>

                {!hasItems ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-600">
                        Кошик порожній.{' '}
                        <Link href="/catalog" className="text-[#D08B4C] font-medium hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-12">
                        {/* Items */}
                        <section className="md:col-span-8 space-y-4">
                            {items.map((it) => (
                                <article
                                    key={it.id}
                                    className="relative flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
                                >
                                    {/* delete */}
                                    <button
                                        onClick={() => removeItem(it.id)}
                                        className="absolute top-2 right-2 z-10 grid h-8 w-8 place-items-center rounded-full
                               border border-red-300/60 bg-red-50 text-red-600
                               hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        aria-label="Видалити товар"
                                        title="Видалити"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <path d="M3 6h18M8 6l1-2h6l1 2M7 6v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6"
                                                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                        </svg>
                                    </button>

                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                                        <Image src={it.image} alt={it.title} fill className="object-contain" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-medium text-neutral-900 line-clamp-2">{it.title}</h3>
                                        <p className="mt-1 text-sm text-neutral-600">
                                            {it.type}, {it.thickness} мм · {it.format} · {it.grade} · {it.manufacturer}
                                            {it.waterproofing ? `, ${it.waterproofing}` : ''}
                                        </p>

                                        <div className="mt-3 flex items-center gap-4">
                                            {/* qty stepper */}
                                            <div className="inline-flex items-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
                                                <button
                                                    className="px-3 py-1.5 hover:bg-neutral-50"
                                                    onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}
                                                    aria-label="Зменшити кількість"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    value={it.quantity}
                                                    onChange={(e) => {
                                                        const v = Number(e.target.value)
                                                        if (Number.isFinite(v) && v > 0) updateQty(it.id, v)
                                                    }}
                                                    className="w-12 text-center outline-none"
                                                    inputMode="numeric"
                                                    aria-label="Кількість"
                                                />
                                                <button
                                                    className="px-3 py-1.5 hover:bg-neutral-50"
                                                    onClick={() => updateQty(it.id, it.quantity + 1)}
                                                    aria-label="Збільшити кількість"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="ml-auto text-right">
                                                <div className="text-xs text-neutral-500">Сума</div>
                                                <div className="font-semibold">₴{it.price * it.quantity}</div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {/* <-- НОВЕ посилання під списком товарів */}
                            <div className="pt-1">
                                <Link
                                    href="/catalog"
                                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#D08B4C] hover:underline"
                                >
                                    Додати ще товари
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </section>

                        {/* Summary */}
                        <aside className="md:col-span-4">
                            <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-5">
                                <h2 className="mb-4 text-lg font-semibold">Підсумок</h2>

                                <dl className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-neutral-600">Товари</dt>
                                        <dd className="font-medium">₴{subtotal}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-neutral-600">Доставка</dt>
                                        <dd className="font-medium">Розрахуємо при оформленні</dd>
                                    </div>
                                </dl>

                                <div className="my-4 h-px bg-neutral-200" />

                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-neutral-600">Разом</span>
                                    <span className="text-2xl font-semibold text-neutral-900">₴{subtotal}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={clearCart}
                                        className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 hover:bg-neutral-50 text-sm"
                                    >
                                        Очистити
                                    </button>
                                    <Link
                                        href="/checkout"
                                        className="flex-1 text-sm rounded-xl bg-[#D08B4C] px-4 py-2 text-center font-medium text-white hover:bg-[#c57b37]"
                                    >
                                        Перейти до оплати
                                    </Link>
                                </div>

                                <Link
                                    href="/catalog"
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm text-[#D08B4C] hover:underline"
                                >
                                    Продовжити покупки
                                </Link>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    )
}

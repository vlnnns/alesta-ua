'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'

export default function CartPageClient() {
    const { items, subtotal, updateQty, removeItem, clearCart } = useCart()

    return (
        <main className="px-4 sm:px-6 py-10 bg-white text-neutral-800 z-50 ">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-neutral-900">Кошик</h1>

                {items.length === 0 ? (
                    <div className="text-neutral-600">
                        Кошик порожній.{' '}
                        <Link href="/catalog" className="text-[#D08B4C] hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {items.map((it) => (
                                <div key={it.id} className="flex gap-4 items-start border rounded-xl p-4">
                                    <div className="relative w-24 h-24 bg-neutral-100 rounded overflow-hidden shrink-0">
                                        <Image src={it.image} alt={it.title} fill className="object-contain" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-neutral-900">{it.title}</div>
                                        <div className="text-sm text-neutral-600">
                                            {it.type}, {it.thickness} мм · {it.format} · {it.grade} · {it.manufacturer}
                                            {it.waterproofing ? `, ${it.waterproofing}` : ''}
                                        </div>

                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="inline-flex items-center border rounded">
                                                <button
                                                    className="px-2 py-1"
                                                    onClick={() => updateQty(it.id, it.quantity - 1)}
                                                    aria-label="Зменшити кількість"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    value={it.quantity}
                                                    onChange={(e) => {
                                                        const v = Number(e.target.value)
                                                        if (Number.isFinite(v)) updateQty(it.id, v)
                                                    }}
                                                    className="w-12 text-center outline-none"
                                                    inputMode="numeric"
                                                    aria-label="Кількість"
                                                />
                                                <button
                                                    className="px-2 py-1"
                                                    onClick={() => updateQty(it.id, it.quantity + 1)}
                                                    aria-label="Збільшити кількість"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="ml-auto font-semibold">₴{it.price * it.quantity}</div>
                                        </div>

                                        <button
                                            className="text-xs text-red-600 mt-1 hover:underline"
                                            onClick={() => removeItem(it.id)}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={clearCart}
                                className="border rounded-lg px-4 py-2 hover:bg-black/5"
                            >
                                Очистити кошик
                            </button>

                            <div className="text-right">
                                <div className="text-sm text-neutral-600">Разом</div>
                                <div className="text-2xl font-semibold text-neutral-900">₴{subtotal}</div>
                                <button className="mt-3 rounded-lg px-5 py-2 bg-[#D08B4C] hover:bg-[#c57b37] text-white">
                                    Перейти до оплати
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

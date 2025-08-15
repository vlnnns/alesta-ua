'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartProvider'

export default function CartDrawer() {
    const { isOpen, close, items, updateQty, removeItem, subtotal, clearCart } = useCart()

    return (
        <>
            {/* backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={close}
            />
            {/* panel */}
            <aside
                className={`fixed z-50 top-0 right-0 h-full w-[360px] max-w-[90vw] bg-white shadow-xl border-l transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-hidden={!isOpen}
            >
                <div className="flex items-center justify-between p-4 border-b text-neutral-800">
                    <h3 className="text-lg font-semibold">Ваш кошик</h3>
                    <button onClick={close} className="p-2 hover:bg-black/5 rounded cursor-pointer">✕</button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-180px)] text-neutral-800">
                    {items.length === 0 ? (
                        <p className="text-sm text-neutral-600">Кошик порожній</p>
                    ) : items.map(it => (
                        <div key={it.id} className="flex gap-3 items-start border rounded-lg p-3">
                            <div className="relative w-16 h-16 bg-neutral-100 rounded overflow-hidden shrink-0">
                                <Image src={it.image} alt={it.title} fill className="object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900 line-clamp-2">{it.title}</div>
                                <div className="text-xs text-neutral-600 mt-1">
                                    {it.type}, {it.thickness} мм · {it.format}<br/>
                                    {it.grade} · {it.manufacturer}{it.waterproofing ? `, ${it.waterproofing}` : ''}
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="inline-flex items-center border rounded">
                                        <button className="px-2 py-1" onClick={() => updateQty(it.id, it.quantity - 1)}>-</button>
                                        <input
                                            value={it.quantity}
                                            onChange={(e) => {
                                                const v = Number(e.target.value)
                                                if (Number.isFinite(v)) updateQty(it.id, v)
                                            }}
                                            className="w-10 text-center outline-none"
                                        />
                                        <button className="px-2 py-1" onClick={() => updateQty(it.id, it.quantity + 1)}>+</button>
                                    </div>
                                    <div className="ml-auto font-semibold">₴{it.price * it.quantity}</div>
                                </div>
                                <button className="text-xs text-red-600 mt-1 hover:underline" onClick={() => removeItem(it.id)}>
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-neutral-600">Разом</span>
                        <span className="text-lg font-semibold text-neutral-900">₴{subtotal}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={clearCart} className="flex-1 border rounded-lg px-4 py-2 hover:bg-black/5 text-neutral-800">Очистити</button>
                        <Link href="/cart" onClick={close} className="flex-1 text-center rounded-lg px-4 py-2 bg-[#D08B4C] hover:bg-[#c57b37] text-white">
                            Оформити
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    )
}

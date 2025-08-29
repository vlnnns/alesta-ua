'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { useCart } from './CartProvider'

export default function CartDrawer() {
    const { isOpen, close, items, updateQty, removeItem, subtotal, clearCart } = useCart()

    // блокуємо прокрутку body, коли кошик відкритий
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = isOpen ? 'hidden' : prev || ''
        return () => { document.body.style.overflow = prev }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[800] bg-black/50 backdrop-blur-sm transition-opacity duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={close}
                aria-hidden
            />

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 z-[900] w-[min(420px,100vw)] h-[100dvh]
        bg-neutral-900/90 text-white backdrop-blur-xl border-l border-white/10
        transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog" aria-modal="true" aria-hidden={!isOpen}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-base font-semibold">Ваш кошик</h3>
                        <button
                            onClick={close}
                            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/10"
                            aria-label="Закрити кошик"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* List (scroll area) */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {items.length === 0 ? (
                            <p className="text-sm text-white/70">
                                Кошик порожній.{' '}
                                <Link href="/catalog" onClick={close} className="text-[#D08B4C] font-medium hover:underline">
                                    Перейти в каталог
                                </Link>
                            </p>
                        ) : (
                            <>
                                {items.map((it) => (
                                    <div key={it.id} className="group relative flex gap-3 items-start rounded-xl border border-white/10 bg-white/[0.04] p-3">
                                        {/* remove */}
                                        <button
                                            onClick={() => removeItem(it.id)}
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition
                                    inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10
                                    px-2 py-1 text-[11px] hover:bg-white/15"
                                            aria-label="Видалити товар"
                                            title="Видалити товар"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Видалити
                                        </button>

                                        <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 border border-white/10 bg-white/5">
                                            <Image src={it.image} alt={it.title} fill className="object-contain" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium line-clamp-2">{it.title}</div>
                                            <div className="mt-1 text-xs text-white/70">
                                                {it.type}{it.thickness ? `, ${it.thickness} мм` : ''}{it.format ? ` · ${it.format}` : ''}
                                                <br />
                                                {it.grade}{it.manufacturer ? ` · ${it.manufacturer}` : ''}{it.waterproofing ? `, ${it.waterproofing}` : ''}
                                            </div>

                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="inline-flex items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                                    <button
                                                        className="px-2 py-1 hover:bg-white/10"
                                                        onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}
                                                        aria-label="−"
                                                    >−</button>
                                                    <input
                                                        value={it.quantity}
                                                        onChange={(e) => {
                                                            const v = Number(e.target.value)
                                                            if (Number.isFinite(v) && v > 0) updateQty(it.id, v)
                                                        }}
                                                        className="w-10 bg-transparent text-center outline-none"
                                                        inputMode="numeric"
                                                        aria-label="Кількість"
                                                    />
                                                    <button
                                                        className="px-2 py-1 hover:bg-white/10"
                                                        onClick={() => updateQty(it.id, it.quantity + 1)}
                                                        aria-label="+"
                                                    >+</button>
                                                </div>
                                                <div className="ml-auto font-semibold">₴{it.price * it.quantity}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* простий текстовий лінк одразу під картками */}
                                <div className="pt-1">
                                    <Link
                                        href="/catalog"
                                        onClick={close}
                                        className="text-sm font-medium text-[#D08B4C] hover:underline"
                                    >
                                        Додати ще товари
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/10 bg-gradient-to-t from-neutral-900/80 to-neutral-900/50 px-4 py-4">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm text-white/70">Разом</span>
                            <span className="text-lg font-semibold">₴{subtotal}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={clearCart}
                                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
                            >
                                Очистити
                            </button>
                            <Link
                                href="/checkout"
                                onClick={close}
                                className="flex-1 text-center rounded-lg bg-[#D08B4C] px-4 py-2 font-medium text-white hover:bg-[#c57b37]"
                            >
                                Оформити
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

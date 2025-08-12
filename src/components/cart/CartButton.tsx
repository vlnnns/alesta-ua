'use client'

import { useCart } from './CartProvider'

export default function CartButton({ className = '' }: { className?: string }) {
    const { count, toggle } = useCart()
    return (
        <button
            onClick={toggle}
            className={`relative cursor-pointer inline-flex items-center gap-2 px-3 py-2 hover:bg-black/5 transition ${className}`}
            aria-label="Відкрити корзину"
        >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            {!!count && (
                <span className="absolute -top-1 -right-1 text-xs font-semibold bg-[#D08B4C] text-white rounded-full px-1.5 py-0.5">
          {count}
        </span>
            )}
        </button>
    )
}

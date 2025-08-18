'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { calcSubtotal, makeCartItemId } from '@/lib/cart'
import type { CartItem } from '@/lib/cart'

type CartContextValue = {
    items: CartItem[]
    isOpen: boolean
    count: number
    subtotal: number
    open: () => void
    close: () => void
    toggle: () => void
    addItem: (input: Omit<CartItem, 'id' | 'quantity' | 'title'> & { quantity?: number; title?: string }) => void
    updateQty: (id: string, quantity: number) => void
    removeItem: (id: string) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const LS_KEY = 'cart:v1'

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setOpen] = useState(false)

    // hydrate from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return;

            const fixed = parsed.map((it: any) => {
                // уже новый формат — оставляем как есть
                if (typeof it?.productId === 'number' && Number.isFinite(it.productId)) return it;

                // пробуем вытащить productId из строкового id (берём первое число)
                const fromId = Number(String(it?.id ?? '').match(/\d+/)?.[0]);
                return {
                    ...it,
                    productId: Number.isFinite(fromId) ? fromId : undefined,
                };
            });

            setItems(fixed as CartItem[]);
        } catch {
            // ignore
        }
    }, []);


    // persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(items))
        } catch {
            // ignore
        }
    }, [items])

    const count = useMemo(() => items.reduce((n, it) => n + it.quantity, 0), [items])
    const subtotal = useMemo(() => calcSubtotal(items), [items])

    const open = useCallback(() => setOpen(true), [])
    const close = useCallback(() => setOpen(false), [])
    const toggle = useCallback(() => setOpen(v => !v), [])

    const addItem: CartContextValue['addItem'] = useCallback((input) => {
        const id = makeCartItemId({
            productId: input.productId,
            type: input.type,
            thickness: input.thickness,
            format: input.format,
            grade: input.grade,
            manufacturer: input.manufacturer,
            waterproofing: input.waterproofing,
        })
        const quantity = Math.max(1, input.quantity ?? 1)

        setItems(prev => {
            const idx = prev.findIndex(it => it.id === id)
            if (idx >= 0) {
                const next = [...prev]
                next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
                return next
            }
            const title = input.title ?? `Фанера ${input.type} ${input.thickness} мм`
            const newItem: CartItem = {
                id,
                productId: input.productId,
                image: input.image,
                title,
                price: input.price,
                quantity,
                type: input.type,
                thickness: input.thickness,
                format: input.format,
                grade: input.grade,
                manufacturer: input.manufacturer,
                waterproofing: input.waterproofing,
            }
            return [newItem, ...prev]
        })
    }, [])

    const updateQty = useCallback((id: string, quantity: number) => {
        setItems(prev =>
            prev
                .map(it => (it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it))
                .filter(it => it.quantity > 0),
        )
    }, [])

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(it => it.id !== id))
    }, [])

    const clearCart = useCallback(() => setItems([]), [])

    const value: CartContextValue = {
        items, isOpen, count, subtotal,
        open, close, toggle,
        addItem, updateQty, removeItem, clearCart,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within <CartProvider>')
    return ctx
}

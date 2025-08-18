'use client'

import { useMemo, useState } from 'react'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'
import type { PlywoodProduct } from '@prisma/client'
import { useCart } from '@/components/cart/CartProvider'

type Props = {
    items: PlywoodProduct[]
    title?: string
    onEditFilters?: () => void
    productCardHeight?: number
}

type Expanded = Record<number, boolean>

export default function ResultsGrid({
                                        items,
                                        title = 'Результати підбору',
                                        onEditFilters,
                                        productCardHeight = 420,
                                    }: Props) {
    const [expanded, setExpanded] = useState<Expanded>({})
    const { addItem, open } = useCart()

    const toggle = (id: number) =>
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

    // Опції для селектів (як у компоненті рекомендованих)
    const options: ProductCardOptions = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        return {
            types:          uniq(items.map(p => p.type)),
            thicknesses:    uniq(items.map(p => p.thickness)).sort((a, b) => Number(a) - Number(b)),
            formats:        uniq(items.map(p => p.format)),
            grades:         uniq(items.map(p => p.grade)),
            manufacturers:  uniq(items.map(p => p.manufacturer)),
            waterproofings: uniq(items.map(p => p.waterproofing)),
        }
    }, [items])

    // «✔» в карточке — добавить в корзину и закрыть карточку
    const handleSubmit = (payload: {
        id: number
        type: string
        thickness: number
        format: string
        grade: string
        manufacturer: string
        waterproofing: string
    }) => {
        const p = items.find(x => x.id === payload.id)
        if (!p) return

        addItem({
            productId: p.id,
            image: p.image ?? '',
            price: p.price,
            type: payload.type,
            thickness: payload.thickness,
            format: payload.format,
            grade: payload.grade,
            manufacturer: payload.manufacturer,
            waterproofing: payload.waterproofing,
            quantity: 1,
            title: `Фанера ${payload.type} ${payload.thickness} мм`,
        })

        open()
        setExpanded(prev => ({ ...prev, [payload.id]: false }))
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">{title}</h2>
                {onEditFilters && (
                    <button
                        onClick={onEditFilters}
                        className="px-4 py-2 rounded-md border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition"
                    >
                        ← Змінити параметри
                    </button>
                )}
            </div>

            <div className="grid gap-6 w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                {items.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isOpen={!!expanded[product.id]}          // як у RecommendedProducts
                        onToggle={() => toggle(product.id)}      // «+» відкриває/закриває другу сторінку
                        options={options}
                        onSubmit={handleSubmit}                  // «✔» додає в кошик
                        fixedHeight={productCardHeight}
                    />
                ))}
            </div>
        </div>
    )
}

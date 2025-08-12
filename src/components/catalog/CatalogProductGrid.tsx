'use client'

import { useMemo, useState } from 'react'
import type { PlywoodProduct } from '@prisma/client'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'
import { useCart } from '@/components/cart/CartProvider'

export default function CatalogProductGrid({ items }: { items: PlywoodProduct[] }) {
    const [expanded, setExpanded] = useState<Record<number, boolean>>({})
    const { addItem, open } = useCart()

    const toggle = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

    const options: ProductCardOptions = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        return {
            types:          uniq(items.map(p => p.type)),
            thicknesses:    uniq(items.map(p => p.thickness)).sort((a,b)=>Number(a)-Number(b)),
            formats:        uniq(items.map(p => p.format)),
            grades:         uniq(items.map(p => p.grade)),
            manufacturers:  uniq(items.map(p => p.manufacturer)),
            waterproofings: uniq(items.map(p => p.waterproofing)),
        }
    }, [items])

    const handleSubmit = (payload: {
        id: number
        type: string
        thickness: number
        format: string
        grade: string
        manufacturer: string
        waterproofing: string
    }) => {
        const source = items.find(it => it.id === payload.id)
        if (!source) return
        addItem({
            productId: source.id,
            image: source.image,
            price: source.price,
            type: payload.type,
            thickness: payload.thickness,
            format: payload.format,
            grade: payload.grade,
            manufacturer: payload.manufacturer,
            waterproofing: payload.waterproofing,
            title: `Фанера ${payload.type} ${payload.thickness} мм`,
            quantity: 1,
        })
        setExpanded(prev => ({ ...prev, [payload.id]: false }))
        open()
    }

    return (
        <div className="flex flex-wrap gap-6 items-stretch">
            {items.map((p) => (
                <ProductCard
                    key={p.id}
                    product={p}
                    isOpen={!!expanded[p.id]}
                    onToggle={() => toggle(p.id)}   // кнопка “+” открывает редактирование
                    options={options}
                    onSubmit={handleSubmit}         // ✔ добавляет в корзину
                    fixedHeight={420}
                    className="basis-[280px] grow-0 shrink-0"
                />
            ))}
        </div>
    )
}

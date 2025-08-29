'use client'

import { useMemo, useState } from 'react'
import type { PlywoodProduct } from '@prisma/client'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'
import { useCart } from '@/components/cart/CartProvider'

export default function CatalogProductGrid({
                                               items,
                                               mobile = 'full', // 'full' | 'center'
                                           }: {
    items: PlywoodProduct[]
    mobile?: 'full' | 'center'
}) {
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
        id: number; type: string; thickness: number; format: string;
        grade: string; manufacturer: string; waterproofing: string
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

    // 🔹 сортируем: в наличии (inStock !== false) -> вверх; нет в наличии -> вниз
    const sortedItems = useMemo(() => {
        return items
            .map((p, idx) => ({ p, idx }))
            .sort((a, b) => {
                const aOut = a.p.inStock === false ? 1 : 0
                const bOut = b.p.inStock === false ? 1 : 0
                if (aOut !== bOut) return aOut - bOut           // 0 перед 1
                return a.idx - b.idx                             // стабильный порядок внутри групп
            })
            .map(x => x.p)
    }, [items])

    // обёртка для карточки на мобайле:
    const wrapClass = mobile === 'center'
        ? 'w-full max-w-[420px] mx-auto'
        : 'w-full'

    return (
        <div className="
      grid gap-4 sm:gap-6
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      justify-items-stretch
    ">
            {sortedItems.map(p => (
                <div key={p.id} className={wrapClass}>
                    <ProductCard
                        product={p}
                        isOpen={!!expanded[p.id]}
                        onToggle={() => toggle(p.id)}
                        options={options}
                        onSubmit={handleSubmit}
                        className="w-full"
                    />
                </div>
            ))}
        </div>
    )
}

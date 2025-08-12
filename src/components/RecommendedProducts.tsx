'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PlywoodProduct } from '@prisma/client'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'

type Expanded = Record<number, boolean>

export default function RecommendedProducts() {
    const [products, setProducts] = useState<PlywoodProduct[]>([])
    const [expanded, setExpanded] = useState<Expanded>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch('/api/recommend?limit=8', {
                    cache: 'no-store',
                    signal: ac.signal,
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = (await res.json()) as unknown
                setProducts(Array.isArray(data) ? (data as PlywoodProduct[]) : [])
            } catch (e: unknown) {
                // ✅ без any
                const aborted = e instanceof DOMException && e.name === 'AbortError'
                if (!aborted) setError('Не вдалося завантажити рекомендації')
            } finally {
                setLoading(false)
            }
        })()
        return () => ac.abort()
    }, [])

    const toggle = (id: number) =>
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

    // збираємо варіанти для селектів
    const options: ProductCardOptions = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        return {
            types:          uniq(products.map(p => p.type)),
            thicknesses:    uniq(products.map(p => p.thickness)).sort((a,b)=>Number(a)-Number(b)),
            formats:        uniq(products.map(p => p.format)),
            grades:         uniq(products.map(p => p.grade)),
            manufacturers:  uniq(products.map(p => p.manufacturer)),
            waterproofings: uniq(products.map(p => p.waterproofing)),
        }
    }, [products])

    const handleSubmit = (payload: {
        id: number
        type: string
        thickness: number
        format: string
        grade: string
        manufacturer: string
        waterproofing: string
    }) => {
        // тут може бути API-збереження / додавання в кошик
        console.log('Submit product changes:', payload)
        setExpanded(prev => ({ ...prev, [payload.id]: false }))
    }

    return (
        <section className="bg-black bg-cover bg-center py-16 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-10">Рекомендовані товари</h2>

                {loading ? (
                    <p className="text-white/70">Завантаження…</p>
                ) : error ? (
                    <p className="text-red-300">{error}</p>
                ) : products.length === 0 ? (
                    <p className="text-white/70">Поки немає рекомендацій.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((p) => (
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
                )}
            </div>
        </section>
    )
}

'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import type { PlywoodProduct } from '@prisma/client'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'
import { useCart } from '@/components/cart/CartProvider'

import useEmblaCarousel from 'embla-carousel-react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const BRAND = '#D08B4C'
const MAX = 4

type Expanded = Record<number, boolean>

export default function RecommendedProducts() {
    const [products, setProducts] = useState<PlywoodProduct[]>([])
    const [expanded, setExpanded] = useState<Expanded>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { addItem, open } = useCart()

    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                // просим у API максимум 6
                const res = await fetch(`/api/recommend?limit=${MAX}`, { cache: 'no-store', signal: ac.signal })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                // и всё равно режем на клиенте до 6
                const list = Array.isArray(data) ? (data as PlywoodProduct[]) : []
                setProducts(list.slice(0, MAX))
            } catch (e: unknown) {
                const aborted = e instanceof DOMException && e.name === 'AbortError'
                if (!aborted) setError('Не вдалося завантажити рекомендації')
            } finally {
                setLoading(false)
            }
        })()
        return () => ac.abort()
    }, [])

    // используем именно "видимые" элементы (у нас и так уже 0..6)
    const items = useMemo(() => products.slice(0, MAX), [products])

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

    // Embla (мобільна)
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    })

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
    const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [snapCount, setSnapCount] = useState(0)

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
        setSnapCount(emblaApi.scrollSnapList().length)
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', () => {
            setSnapCount(emblaApi.scrollSnapList().length)
            onSelect()
        })
    }, [emblaApi])

    return (
        <section className="bg-[#202020] bg-cover bg-center py-16 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-10">Рекомендовані товари</h2>

                {loading ? (
                    <p className="text-white/70">Завантаження…</p>
                ) : error ? (
                    <p className="text-red-300">{error}</p>
                ) : items.length === 0 ? (
                    <p className="text-white/70">Поки немає рекомендацій.</p>
                ) : (
                    <>
                        {/* 🔹 Мобільна карусель */}
                        <div className="md:hidden">
                            <div className="overflow-hidden px-1" ref={emblaRef}>
                                <div className="flex gap-4">
                                    {items.map((p) => (
                                        <div key={p.id} className="basis-[78%] shrink-0">
                                            <ProductCard
                                                product={p}
                                                isOpen={!!expanded[p.id]}
                                                onToggle={() => toggle(p.id)}
                                                options={options}
                                                onSubmit={handleSubmit}
                                                fixedHeight={380}
                                                className="!w-full rounded-2xl border border-white/10 bg-white/5 shadow-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* навигация */}
                            <div className="mt-5 flex items-center justify-start gap-5">
                                <button
                                    onClick={scrollPrev}
                                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95"
                                    style={{ backgroundColor: BRAND, color: 'white' }}
                                    aria-label="Попередній"
                                >
                                    <IoChevronBack size={20} />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: snapCount }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => scrollTo(i)}
                                            aria-label={`Слайд ${i + 1}`}
                                            className="h-1.5 w-1.5 rounded-full transition-[transform,background-color]"
                                            style={{
                                                backgroundColor: i === selectedIndex ? BRAND : '#E5E7EB',
                                                transform: i === selectedIndex ? 'scale(1.1)' : 'scale(1)',
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={scrollNext}
                                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95"
                                    style={{ backgroundColor: BRAND, color: 'white' }}
                                    aria-label="Наступний"
                                >
                                    <IoChevronForward size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 🔹 Десктоп/планшет */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    isOpen={!!expanded[p.id]}
                                    onToggle={() => toggle(p.id)}
                                    options={options}
                                    onSubmit={handleSubmit}
                                    fixedHeight={420}
                                    className="rounded-2xl border border-white/10 bg-white/5 shadow-lg"
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

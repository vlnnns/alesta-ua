'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import type { PlywoodProduct } from '@prisma/client'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'
import { useCart } from '@/components/cart/CartProvider'

import useEmblaCarousel from 'embla-carousel-react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

/** Constants */
const BRAND_COLOR = '#D08B4C'
const MAX_ITEMS = 4

/** Helpers */
const uniq = <T,>(arr: (T | null | undefined)[]): T[] =>
    [...new Set(arr.filter((x): x is T => x != null))]

type ExpandedMap = Record<number, boolean>

export default function RecommendedProducts() {
    const [products, setProducts] = useState<PlywoodProduct[]>([])
    const [expanded, setExpanded] = useState<ExpandedMap>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { addItem, open } = useCart()

    /** Fetch recommendations */
    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await fetch(`/api/recommend?limit=${MAX_ITEMS}`, {
                    cache: 'no-store',
                    signal: ac.signal,
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)

                const data: unknown = await res.json()
                const list = Array.isArray(data) ? (data as PlywoodProduct[]) : []
                setProducts(list.slice(0, MAX_ITEMS))
            } catch (err) {
                if (!(err instanceof DOMException && err.name === 'AbortError')) {
                    console.error('[RecommendedProducts] fetch error', err)
                    setError('Не вдалося завантажити рекомендації')
                }
            } finally {
                setLoading(false)
            }
        })()

        return () => ac.abort()
    }, [])

    /** Use only first MAX_ITEMS */
    const items = useMemo(() => products.slice(0, MAX_ITEMS), [products])

    /** Expand / collapse product details */
    const toggle = (id: number) =>
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

    /** Extract options for product variations */
    const options: ProductCardOptions = useMemo(() => {
        return {
            types: uniq(items.map((p) => p.type)),
            thicknesses: uniq(items.map((p) => p.thickness)).sort(
                (a, b) => Number(a) - Number(b)
            ),
            formats: uniq(items.map((p) => p.format)),
            grades: uniq(items.map((p) => p.grade)),
            manufacturers: uniq(items.map((p) => p.manufacturer)),
            waterproofings: uniq(items.map((p) => p.waterproofing)),
        }
    }, [items])

    /** Add to cart handler */
    const handleSubmit = (payload: {
        id: number
        type: string
        thickness: number
        format: string
        grade: string
        manufacturer: string
        waterproofing: string
    }) => {
        const product = items.find((x) => x.id === payload.id)
        if (!product) return

        addItem({
            productId: product.id,
            image: product.image ?? '',
            price: product.price,
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
        setExpanded((prev) => ({ ...prev, [payload.id]: false }))
    }

    /** Embla carousel setup (mobile) */
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    })

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
    const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

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

    /** Render */
    return (
        <section className="relative py-16 px-6 text-white">
            {/* Background image */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="/recommended-bg.png" // 👉 положи картинку в /public/recommended-bg.jpg
                    alt="Background"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="mx-auto max-w-7xl relative z-10">
                <h2 className="mb-10 text-3xl font-bold">Рекомендовані товари</h2>

                {loading ? (
                    <p className="text-white/70">Завантаження…</p>
                ) : error ? (
                    <p className="text-red-300">{error}</p>
                ) : items.length === 0 ? (
                    <p className="text-white/70">Поки немає рекомендацій.</p>
                ) : (
                    <>
                        {/* 🔹 Mobile carousel */}
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

                            {/* Navigation */}
                            <div className="mt-5 flex items-center justify-start gap-5">
                                <button
                                    onClick={scrollPrev}
                                    className="flex h-8 w-8 items-center justify-center rounded-full shadow-md active:scale-95"
                                    style={{ backgroundColor: BRAND_COLOR }}
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
                                                backgroundColor:
                                                    i === selectedIndex ? BRAND_COLOR : '#E5E7EB',
                                                transform:
                                                    i === selectedIndex ? 'scale(1.1)' : 'scale(1)',
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={scrollNext}
                                    className="flex h-8 w-8 items-center justify-center rounded-full shadow-md active:scale-95"
                                    style={{ backgroundColor: BRAND_COLOR }}
                                    aria-label="Наступний"
                                >
                                    <IoChevronForward size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 🔹 Desktop / tablet grid */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((p) => (
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

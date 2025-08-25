'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ProductCard, { type ProductCardOptions } from '@/components/product/ProductCard'
import type { PlywoodProduct } from '@prisma/client'
import { useCart } from '@/components/cart/CartProvider'
import useEmblaCarousel from 'embla-carousel-react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

type Filters = Partial<{
    type: string[]
    thickness: string[]
    format: string[]
    grade: string[]
    manufacturer: string[]
    waterproofing: string[]
}>

type Props = {
    items: PlywoodProduct[]
    title?: string
    onEditFilters?: () => void
    productCardHeight?: number
    /** поточні відповіді квіза (для клієнтського фільтрування) */
    filters?: Filters
}

type Expanded = Record<number, boolean>

const BRAND = '#D08B4C'

function normalizeStr(v: unknown) {
    return String(v ?? '').trim().toLowerCase()
}
function strInList(v: unknown, list: string[]) {
    const needle = normalizeStr(v)
    return list.some(x => normalizeStr(x) === needle)
}
function numInList(n: number, list: string[]) {
    const asNum = Number.isFinite(Number(n)) ? Number(n) : NaN
    return list.some(x => {
        const xn = Number(x)
        return (Number.isFinite(asNum) && Number.isFinite(xn) && asNum === xn)
            || normalizeStr(n) === normalizeStr(x)
    })
}

/** продукт відповідає фільтрам (AND по полях, OR усередині списків) */
function matchesProduct(p: PlywoodProduct, f?: Filters) {
    if (/мебл/i.test(p.type) || normalizeStr(p.type) === normalizeStr('ФКМ')) return false
    if (!f) return true
    if (f.type?.length && !strInList(p.type, f.type)) return false
    if (f.thickness?.length && !numInList(p.thickness, f.thickness)) return false
    if (f.format?.length && !strInList(p.format, f.format)) return false
    if (f.grade?.length && !strInList(p.grade, f.grade)) return false
    if (f.manufacturer?.length && !strInList(p.manufacturer, f.manufacturer)) return false
    if (f.waterproofing?.length && !strInList(p.waterproofing, f.waterproofing)) return false
    return true
}

export default function ResultsGrid({
                                        items,
                                        title = 'Результати підбору',
                                        onEditFilters,
                                        productCardHeight = 420,
                                        filters,
                                    }: Props) {
    const [expanded, setExpanded] = useState<Expanded>({})
    const { addItem, open } = useCart()

    const toggle = (id: number) =>
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

    // 1) клієнтське фільтрування; 2) сортування: в наявності → дешевші
    const filtered = useMemo(() => {
        const arr = items.filter(p => matchesProduct(p, filters))
        return arr.sort((a, b) => {
            const stockDiff = Number(!!b.inStock) - Number(!!a.inStock)
            if (stockDiff !== 0) return stockDiff
            return Number(a.price) - Number(b.price)
        })
    }, [items, filters])

    // опції для селектів
    const options: ProductCardOptions = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        return {
            types:          uniq(filtered.map(p => p.type)),
            thicknesses:    uniq(filtered.map(p => p.thickness)).sort((a, b) => Number(a) - Number(b)),
            formats:        uniq(filtered.map(p => p.format)),
            grades:         uniq(filtered.map(p => p.grade)),
            manufacturers:  uniq(filtered.map(p => p.manufacturer)),
            waterproofings: uniq(filtered.map(p => p.waterproofing)),
        }
    }, [filtered])

    // додати в кошик
    const handleSubmit = (payload: {
        id: number
        type: string
        thickness: number
        format: string
        grade: string
        manufacturer: string
        waterproofing: string
    }) => {
        const p = filtered.find(x => x.id === payload.id)
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

    // ====== мобільна карусель (Embla) ======
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
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                    {title}
                    <span className="ml-2 text-sm font-normal text-white/70">({filtered.length})</span>
                </h2>

                <div className="flex items-center gap-2">
                    {onEditFilters && (
                        <button
                            onClick={onEditFilters}
                            className="px-4 py-2 rounded-md border border-white/70 text-white hover:bg-white/10 transition"
                        >
                            ← Змінити параметри
                        </button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center text-white/80 py-10">
                    Нічого не знайдено за вибраними фільтрами.
                </div>
            ) : (
                <>
                    {/* 🔹 мобільна карусель */}
                    <div className="md:hidden">
                        <div className="overflow-hidden px-1" ref={emblaRef}>
                            <div className="flex gap-4">
                                {filtered.map((product) => (
                                    <div key={product.id} className="basis-[78%] shrink-0">
                                        <ProductCard
                                            product={product}
                                            isOpen={!!expanded[product.id]}
                                            onToggle={() => toggle(product.id)}
                                            options={options}
                                            onSubmit={handleSubmit}
                                            fixedHeight={380}
                                            className="rounded-2xl border border-white/10 bg-white/5 shadow-lg !w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* нижня навігація */}
                        <div className="mt-5 flex items-center justify-center gap-5">
                            <button
                                onClick={scrollPrev}
                                className="w-11 h-11 rounded-full flex items-center justify-center shadow-md active:scale-95"
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
                                        className="h-2.5 w-2.5 rounded-full transition-[transform,background-color]"
                                        style={{
                                            backgroundColor: i === selectedIndex ? BRAND : 'rgba(255,255,255,0.35)',
                                            transform: i === selectedIndex ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={scrollNext}
                                className="w-11 h-11 rounded-full flex items-center justify-center shadow-md active:scale-95"
                                style={{ backgroundColor: BRAND, color: 'white' }}
                                aria-label="Наступний"
                            >
                                <IoChevronForward size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 🔹 десктоп/планшет — сітка */}
                    <div className="hidden md:grid gap-6 w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                        {filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isOpen={!!expanded[product.id]}
                                onToggle={() => toggle(product.id)}
                                options={options}
                                onSubmit={handleSubmit}
                                fixedHeight={productCardHeight}
                                className="rounded-2xl border border-white/10 bg-white/5 shadow-lg"
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

'use client'

import Image from 'next/image'
import type { PlywoodProduct } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'

export type ProductCardOptions = {
    types: string[]
    thicknesses: number[]
    formats: string[]
    grades: string[]
    manufacturers: string[]
    waterproofings: string[]
}

type ProductCardProps = {
    product: PlywoodProduct
    isOpen?: boolean
    onToggle?: () => void
    options?: Partial<ProductCardOptions>
    onSubmit?: (payload: {
        id: number
        type: string
        thickness: number
        format: string
        grade: string
        manufacturer: string
        waterproofing: string
    }) => void
    className?: string
    fixedHeight?: number // default 420
}

/** додає поточне значення в список, якщо його там немає */
function useEnsureCurrent<T>(arr: T[] | undefined, current: T) {
    return useMemo(() => {
        const base = Array.isArray(arr) ? [...arr] : []
        if (!base.some(v => String(v) === String(current))) base.unshift(current)
        return base
    }, [arr, current])
}

function StockBadge({
                        inStock,
                        className = '',
                        size = 'md',
                    }: { inStock: boolean; className?: string; size?: 'sm' | 'md' }) {
    const sizing = size === 'sm'
        ? 'px-2.5 py-0.5 text-[11px]'
        : 'px-3 py-1 text-xs'

    const ok = inStock
        ? 'bg-emerald-50/80 text-emerald-800 ring-1 ring-emerald-200/70 shadow-sm'
        : 'bg-neutral-100/80 text-neutral-600 ring-1 ring-neutral-200/70'

    return (
        <span
            className={[
                'inline-flex items-center gap-1.5 rounded-full backdrop-blur',
                sizing, ok, className,
            ].join(' ')}
            title={inStock ? 'В наявності' : 'Немає в наявності'}
        >
      {inStock ? (
          <>
              <span className="font-medium">В наявності</span>
          </>
      ) : (
          <>
              {/* іконка «нема» */}
              <svg className="h-3.5 w-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="font-medium">Немає</span>
          </>
      )}
    </span>
    )
}

export default function ProductCard({
                                        product,
                                        isOpen = false,
                                        onToggle,
                                        options,
                                        onSubmit,
                                        className = '',
                                        fixedHeight = 420,
                                    }: ProductCardProps) {
    const [type, setType] = useState(product.type)
    const [thickness, setThickness] = useState<number>(product.thickness)
    const [format, setFormat] = useState(product.format)
    const [grade, setGrade] = useState(product.grade)
    const [manufacturer, setManufacturer] = useState(product.manufacturer)
    const [waterproofing, setWaterproofing] = useState(product.waterproofing)

    useEffect(() => {
        setType(product.type)
        setThickness(product.thickness)
        setFormat(product.format)
        setGrade(product.grade)
        setManufacturer(product.manufacturer)
        setWaterproofing(product.waterproofing)
    }, [product])

    const inStock = product.inStock !== false

    const optTypes = useEnsureCurrent(options?.types, product.type)
    const optThicknesses = useEnsureCurrent(options?.thicknesses, product.thickness)
    const optFormats = useEnsureCurrent(options?.formats, product.format)
    const optGrades = useEnsureCurrent(options?.grades, product.grade)
    const optManufacturers = useEnsureCurrent(options?.manufacturers, product.manufacturer)
    const optWater = useEnsureCurrent(options?.waterproofings, product.waterproofing)

    return (
        <div
            className={[
                'relative isolate overflow-hidden rounded-md',
                'h-full min-h-[260px] p-6 transition-shadow',
                'bg-white/90 backdrop-blur-sm', // полупрозрачный фон
                'text-black border border-neutral-200/70',
                className,
            ].join(' ')}
            style={{ height: fixedHeight }}
        >
            {/* VIEW */}
            <div
                className={[
                    'absolute inset-0 flex min-h-0 flex-col p-4',
                    'transition-transform duration-500 ease-out',
                    isOpen ? '-translate-y-full' : 'translate-y-0',
                ].join(' ')}
            >
                {/* Header */}
                <div className="mb-2 flex items-center gap-2 text-md font-semibold text-neutral-900">
          <span className="truncate">
            {product.type} {product.thickness} мм
          </span>

                    <StockBadge inStock={inStock} className="ml-auto" />


                </div>

                {/* Image на весь доступный размер */}
                <div className="relative mb-4 flex-1 min-h-[180px] rounded-xl overflow-hidden border border-neutral-200/60">
                    <Image
                        src={product.image}
                        alt={product.type}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                    />
                    {!inStock && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/45 text-white text-xs text-center py-1">
                            Немає в наявності
                        </div>
                    )}
                </div>


                {/* Meta */}
                <div className="text-sm text-neutral-600 space-y-0">
                    <div>
                        {product.grade}
                        {product.waterproofing ? `, ${product.waterproofing}` : ''}
                    </div>
                    <div>{product.format}</div>
                    <div>{product.manufacturer}</div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-3">
                    <p
                        className={[
                            'font-semibold',
                            inStock ? 'text-neutral-900' : 'text-neutral-400 line-through',
                        ].join(' ')}
                    >
                        ₴{product.price} / лист
                    </p>

                    {onToggle && (
                        <button
                            onClick={onToggle}
                            disabled={!inStock}
                            className={[
                                'cursor-pointer w-8 h-8 rounded text-lg grid place-items-center',
                                'transition-colors duration-200',
                                inStock
                                    ? 'bg-[#D08B4C] text-white hover:bg-[#c57b37]'
                                    : 'bg-neutral-300 text-white cursor-not-allowed',
                            ].join(' ')}
                            aria-disabled={!inStock}
                            aria-label={inStock ? 'Налаштувати та додати' : 'Немає в наявності'}
                            title={inStock ? 'Налаштувати та додати' : 'Немає в наявності'}
                        >
                            +
                        </button>
                    )}
                </div>
            </div>

            {/* EDIT */}
            <div
                className={[
                    'absolute inset-0 flex flex-col justify-between p-4 bg-white/90',
                    'transition-transform duration-500 ease-out',
                    isOpen ? 'translate-y-0' : 'translate-y-full',
                    'text-sm' // 🔹 ставимо базовий розмір тексту менший
                ].join(' ')}
            >
                <div className="space-y-1">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-medium text-neutral-900">
                        {product.type} {product.thickness} мм
                        <StockBadge inStock={inStock} className="ml-auto" size="sm" />
                    </h3>

                    <Select
                        label="Тип фанери"
                        value={type}
                        onChange={setType}
                        options={optTypes.map(v => ({ value: v, label: v }))}
                        className="text-xs" // 🔹 дрібніший текст у селектах
                    />

                    <Select
                        label="Клей (вологостійкість)"
                        value={waterproofing}
                        onChange={setWaterproofing}
                        options={optWater.map(v => ({ value: v, label: v }))}
                        className="text-xs"
                    />

                    <div className="flex gap-2">
                        <Select
                            className="w-1/2 text-xs"
                            label="Товщина"
                            value={String(thickness)}
                            onChange={(v) => setThickness(Number(v))}
                            options={optThicknesses
                                .slice()
                                .sort((a, b) => Number(a) - Number(b))
                                .map(v => ({ value: String(v), label: `${v} мм` }))}
                        />
                        <Select
                            className="w-1/2 text-xs"
                            label="Формат листа"
                            value={format}
                            onChange={setFormat}
                            options={optFormats.map(v => ({ value: v, label: v }))}
                        />
                    </div>

                    <Select
                        label="Клас фанери"
                        value={grade}
                        onChange={setGrade}
                        options={optGrades.map(v => ({ value: v, label: v }))}
                        className="text-xs"
                    />

                    {!inStock && (
                        <p className="mt-2 text-xs text-red-600">
                            Товар наразі відсутній — додавання до кошика вимкнено.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-base font-semibold text-neutral-900">₴{product.price} / лист</p>
                    <div className="flex gap-2">
                        {onToggle && (
                            <button
                                onClick={onToggle}
                                className="cursor-pointer w-8 h-8 grid place-items-center rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors"
                                aria-label="Закрити"
                                title="Закрити"
                            >
                                ✕
                            </button>
                        )}
                        <button
                            onClick={() =>
                                onSubmit?.({
                                    id: product.id,
                                    type,
                                    thickness,
                                    format,
                                    grade,
                                    manufacturer,
                                    waterproofing,
                                })
                            }
                            disabled={!inStock}
                            className={[
                                'cursor-pointer w-8 h-8 grid place-items-center rounded transition-colors',
                                inStock
                                    ? 'bg-[#D08B4C] text-white hover:bg-[#c57b37]'
                                    : 'bg-neutral-300 text-white cursor-not-allowed',
                            ].join(' ')}
                            aria-disabled={!inStock}
                            aria-label={inStock ? 'Додати до кошика' : 'Немає в наявності'}
                            title={inStock ? 'Додати до кошика' : 'Немає в наявності'}
                        >
                            ✔
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---- універсальний Select ---- */
function Select<T extends string>({
                                      label,
                                      value,
                                      onChange,
                                      options,
                                      className,
                                  }: {
    label: string
    value: T | string
    onChange: (v: T | string) => void
    options: { value: T | string; label: string }[]
    className?: string
}) {
    return (
        <label className={['block text-sm', className ?? ''].join(' ')}>
            <span className="mb-1 block text-neutral-600">{label}</span>
            <div className="relative">
                <select
                    className={[
                        'w-full rounded-md border border-neutral-200 bg-white/70 text-sm text-neutral-900',
                        'px-3 py-2 pr-8 appearance-none',
                        'focus:outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]',
                        'transition-colors',
                    ].join(' ')}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map(opt => (
                        <option key={String(opt.value)} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
          ▾
        </span>
            </div>
        </label>
    )
}

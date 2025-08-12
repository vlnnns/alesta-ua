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

/** ✅ Custom hook: додає поточне значення в список, якщо його там немає */
function useEnsureCurrent<T>(arr: T[] | undefined, current: T) {
    return useMemo(() => {
        const base = Array.isArray(arr) ? [...arr] : []
        if (!base.some(v => String(v) === String(current))) base.unshift(current)
        return base
    }, [arr, current])
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

    // ✅ без порушення правил hooks
    const optTypes = useEnsureCurrent(options?.types, product.type)
    const optThicknesses = useEnsureCurrent(options?.thicknesses, product.thickness)
    const optFormats = useEnsureCurrent(options?.formats, product.format)
    const optGrades = useEnsureCurrent(options?.grades, product.grade)
    const optManufacturers = useEnsureCurrent(options?.manufacturers, product.manufacturer)
    const optWater = useEnsureCurrent(options?.waterproofings, product.waterproofing)

    return (
        <div
            className={`bg-white rounded-xl text-black overflow-hidden relative transition-all border hover:shadow-md ${className}`}
            style={{ height: fixedHeight }}
        >
            {/* VIEW */}
            <div
                className={`absolute inset-0 flex flex-col p-4 transition-transform duration-500 ease-in-out ${
                    isOpen ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="text-sm font-semibold mb-2 text-neutral-800">
                    {product.type} {product.thickness} мм
                </div>
                <div className="w-full h-48 bg-neutral-100 rounded-md overflow-hidden mb-4 relative">
                    <Image
                        src={product.image}
                        alt={product.type}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain"
                    />
                </div>

                <div className="text-sm text-neutral-600">
                    <div className="mb-1">
                        {product.grade}
                        {product.waterproofing ? `, ${product.waterproofing}` : ''}
                    </div>
                    <div className="mb-1">{product.format}</div>
                    <div className="mb-2">{product.manufacturer}</div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <p className="font-semibold text-neutral-900">₴{product.price} / лист</p>
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="w-8 h-8 flex items-center justify-center rounded bg-[#D08B4C] text-white text-lg hover:bg-[#c57b37]"
                        >
                            +
                        </button>
                    )}
                </div>
            </div>

            {/* EDIT */}
            <div
                className={`absolute inset-0 p-4 flex flex-col justify-between bg-white transition-transform duration-500 ease-in-out ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                        Фанера {product.type} {product.thickness} мм
                    </h3>

                    <Select
                        label="Тип фанери"
                        value={type}
                        onChange={setType}
                        options={optTypes.map(v => ({ value: v, label: v }))}
                    />

                    <Select
                        label="Клей (вологостійкість)"
                        value={waterproofing}
                        onChange={setWaterproofing}
                        options={optWater.map(v => ({ value: v, label: v }))}
                    />

                    <div className="flex gap-2">
                        <Select
                            className="w-1/2"
                            label="Товщина"
                            value={String(thickness)}
                            onChange={(v) => setThickness(Number(v))}
                            options={optThicknesses
                                .slice()
                                .sort((a, b) => Number(a) - Number(b))
                                .map(v => ({ value: String(v), label: `${v} мм` }))}
                        />
                        <Select
                            className="w-1/2"
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
                    />

                </div>

                <div className="flex justify-between items-center mt-4">
                    <p className="font-semibold text-base text-neutral-900">
                        ₴{product.price} / лист
                    </p>
                    <div className="flex gap-2">
                        {onToggle && (
                            <button
                                onClick={onToggle}
                                className="w-10 h-10 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-100"
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
                            className="w-10 h-10 flex items-center justify-center bg-[#D08B4C] text-white rounded hover:bg-[#c57b37]"
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
        <label className={`block text-sm ${className ?? ''}`}>
            <span className="block text-neutral-600 mb-1">{label}</span>
            <div className="relative">
                <select
                    className="w-full border rounded px-3 py-2 pr-8 text-sm text-neutral-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]"
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

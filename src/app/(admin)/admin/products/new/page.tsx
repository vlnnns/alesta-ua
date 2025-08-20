'use client'

import { useEffect, useMemo, useState } from 'react'
import { createProduct } from './actions'
import { useRouter } from 'next/navigation'

type Product = {
    id: number
    type: string
    thickness: number
    format: string
    grade: string
    manufacturer: string
    waterproofing: string
    price: number
    image: string | null
    inStock: boolean
}

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    // для подсказок
    const [items, setItems] = useState<Product[]>([])
    const [metaLoading, setMetaLoading] = useState(true)

    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setMetaLoading(true)
                const res = await fetch('/api/admin/products?limit=500', { cache: 'no-store', signal: ac.signal })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json() as { items: Product[] }
                setItems(data.items ?? [])
            } catch {
                // тихо игнорируем — форма всё равно работает
            } finally {
                setMetaLoading(false)
            }
        })()
        return () => ac.abort()
    }, [])

    const meta = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        return {
            types: uniq(items.map(x => x.type)).sort((a, b) => a.localeCompare(b, 'uk')),
            formats: uniq(items.map(x => x.format)).sort((a, b) => a.localeCompare(b, 'uk')),
            grades: uniq(items.map(x => x.grade)).sort((a, b) => a.localeCompare(b, 'uk')),
            manufacturers: uniq(items.map(x => x.manufacturer)).sort((a, b) => a.localeCompare(b, 'uk')),
            waterproofings: uniq(items.map(x => x.waterproofing)).sort((a, b) => a.localeCompare(b, 'uk')),
            thicknesses: uniq(items.map(x => String(x.thickness))).sort((a, b) => Number(a) - Number(b)),
        }
    }, [items])

    const label = 'block text-sm text-neutral-600 mb-1'
    const input = 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]'

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null); setLoading(true)
        const form = new FormData(e.currentTarget)
        const res = await createProduct(form)
        setLoading(false)
        if (!res.ok) { setError(res.error ?? 'Помилка збереження'); return }
        router.push('/admin/products')
    }

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Додати товар</h1>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        className="text-neutral-400 hover:text-neutral-600 text-xl"
                        aria-label="Закрити"
                    >
                        ✖
                    </button>
                </div>

                <form onSubmit={onSubmit} encType="multipart/form-data" className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
                    {/* поля с подсказками из datalist */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className={label}>
                            Тип *
                            <input name="type" className={input} list="types" required />
                        </label>
                        <label className={label}>
                            Товщина (мм) *
                            <input name="thickness" type="number" step="0.1" className={input} list="thicknesses" required />
                        </label>
                        <label className={label}>
                            Формат *
                            <input name="format" className={input} list="formats" required />
                        </label>
                        <label className={label}>
                            Сорт *
                            <input name="grade" className={input} list="grades" required />
                        </label>
                        <label className={label}>
                            Виробник *
                            <input name="manufacturer" className={input} list="manufacturers" required />
                        </label>
                        <label className={label}>
                            Вологостійкість *
                            <input name="waterproofing" className={input} list="waterproofings" required />
                        </label>
                        <label className={label}>
                            Ціна (₴) *
                            <input name="price" type="number" min="0" className={input} required />
                        </label>
                    </div>

                    {/* datalists (видны браузеру при вводе) */}
                    <datalist id="types">
                        {meta.types.map(v => <option key={v} value={v} />)}
                    </datalist>
                    <datalist id="thicknesses">
                        {meta.thicknesses.map(v => <option key={v} value={v} />)}
                    </datalist>
                    <datalist id="formats">
                        {meta.formats.map(v => <option key={v} value={v} />)}
                    </datalist>
                    <datalist id="grades">
                        {meta.grades.map(v => <option key={v} value={v} />)}
                    </datalist>
                    <datalist id="manufacturers">
                        {meta.manufacturers.map(v => <option key={v} value={v} />)}
                    </datalist>
                    <datalist id="waterproofings">
                        {meta.waterproofings.map(v => <option key={v} value={v} />)}
                    </datalist>

                    <div>
                        <label className={label}>
                            Зображення (файл з ПК) *
                            <input
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                className={input}
                                required
                                onChange={(e) => {
                                    const f = e.currentTarget.files?.[0]
                                    setPreview(f ? URL.createObjectURL(f) : null)
                                }}
                            />
                            {preview && (
                                <div className="mt-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={preview} alt="preview" className="h-28 w-28 rounded-lg border border-neutral-200 object-cover" />
                                </div>
                            )}
                        </label>
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input name="inStock" type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-sm text-neutral-700">В наявності</span>
                    </label>

                    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={loading}
                                className="rounded-xl bg-[#D08B4C] px-5 py-3 text-white hover:bg-[#c57b37] disabled:opacity-60">
                            {loading ? 'Зберігаємо…' : 'Створити товар'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/admin/products')}
                            className="rounded-xl border border-neutral-300 px-5 py-3 text-neutral-700 hover:bg-neutral-100"
                        >
                            Скасувати
                        </button>
                    </div>

                    {/* опционально индикатор загрузки подсказок */}
                    {metaLoading && (
                        <div className="text-xs text-neutral-500">Завантажуємо підказки…</div>
                    )}
                </form>
            </div>
        </main>
    )
}

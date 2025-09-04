'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, type CreateResult } from './actions'

type Product = {
    id: number; type: string; thickness: number; format: string; grade: string;
    manufacturer: string; waterproofing: string; price: number; image: string | null; inStock: boolean
}

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    // для діалогу “вже існує”
    const [dup, setDup] = useState<{ id: number | null } | null>(null)

    // підказки
    const [items, setItems] = useState<Product[]>([])
    const [metaLoading, setMetaLoading] = useState(true)

    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setMetaLoading(true)
                const res = await fetch('/api/admin/products?limit=500', { cache: 'no-store', signal: ac.signal })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = (await res.json()) as { items: Product[] }
                setItems(data.items ?? [])
            } catch {
                /* noop — форма працює і без підказок */
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

    async function uploadImage(file: File): Promise<{ ok: boolean; url?: string; path?: string; error?: string }> {
        const fd = new FormData()
        fd.append('image', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) {
            let msg = `Upload HTTP ${res.status}`; try { const j = await res.json(); if (j?.error) msg = j.error } catch {}
            return { ok: false, error: msg }
        }
        const data = (await res.json()) as { url?: string; path?: string }
        return { ok: true, url: data.url, path: data.path }
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null); setLoading(true)
        const formEl = e.currentTarget

        try {
            if (!file) { setError('Додайте файл зображення'); setLoading(false); return }

            // 1) аплоад у /uploads
            const up = await uploadImage(file)
            if (!up.ok || !up.url) { setError(up.error || 'Не вдалося завантажити зображення'); setLoading(false); return }

            // 2) збір даних форми
            const f = new FormData(formEl)
            f.delete('imageFile')

            const thickness = Number(f.get('thickness'))
            const price = Number(f.get('price'))
            const imagePath = up.path ?? new window.URL(up.url!, window.location.href).pathname

            const payload = {
                type: String(f.get('type') || '').trim(),
                thickness: Number.isFinite(thickness) ? thickness : 0,
                format: String(f.get('format') || '').trim(),
                grade: String(f.get('grade') || '').trim(),
                manufacturer: String(f.get('manufacturer') || '').trim(),
                waterproofing: String(f.get('waterproofing') || '').trim(),
                price: Number.isFinite(price) ? price : 0,
                inStock: f.get('inStock') === 'on',
                image: imagePath, // ⬅️ у БД кладемо відносний шлях /uploads/...
            }

            const res: CreateResult = await createProduct(payload)
            setLoading(false)

            if (!res.ok) {
                if (res.code === 'ALREADY_EXISTS') {
                    setDup({ id: res.existingId ?? null })
                    return
                }
                setError(res.error ?? 'Помилка збереження')
                return
            }

            router.push('/admin/products')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Помилка збереження')
            setLoading(false)
        }
    }

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Додати товар</h1>
                    <button type="button" onClick={() => router.push('/admin/products')} className="text-neutral-400 hover:text-neutral-600 text-xl" aria-label="Закрити">✖</button>
                </div>

                <form onSubmit={onSubmit} encType="multipart/form-data" className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className={label}>Тип *<input name="type" className={input} list="types" required /></label>
                        <label className={label}>Товщина (мм) *<input name="thickness" type="number" step="0.1" className={input} list="thicknesses" required /></label>
                        <label className={label}>Формат *<input name="format" className={input} list="formats" required /></label>
                        <label className={label}>Сорт *<input name="grade" className={input} list="grades" required /></label>
                        <label className={label}>Виробник *<input name="manufacturer" className={input} list="manufacturers" required /></label>
                        <label className={label}>Вологостійкість *<input name="waterproofing" className={input} list="waterproofings" required /></label>
                        <label className={label}>Ціна (₴) *<input name="price" type="number" min="0" className={input} required /></label>
                    </div>

                    {/* datalists */}
                    <datalist id="types">{meta.types.map(v => <option key={v} value={v} />)}</datalist>
                    <datalist id="thicknesses">{meta.thicknesses.map(v => <option key={v} value={v} />)}</datalist>
                    <datalist id="formats">{meta.formats.map(v => <option key={v} value={v} />)}</datalist>
                    <datalist id="grades">{meta.grades.map(v => <option key={v} value={v} />)}</datalist>
                    <datalist id="manufacturers">{meta.manufacturers.map(v => <option key={v} value={v} />)}</datalist>
                    <datalist id="waterproofings">{meta.waterproofings.map(v => <option key={v} value={v} />)}</datalist>

                    {/* файл */}
                    <div>
                        <label className={label}>
                            Зображення (файл з ПК) *
                            <input
                                name="imageFile" type="file" accept="image/*" className={input} required
                                onChange={(e) => {
                                    const f = e.currentTarget.files?.[0] || null
                                    setFile(f); setPreview(f ? URL.createObjectURL(f) : null)
                                }}
                            />
                            {preview && (<div className="mt-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt="preview" className="h-28 w-28 rounded-lg border border-neutral-200 object-cover" />
                            </div>)}
                        </label>
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input name="inStock" type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-sm text-neutral-700">В наявності</span>
                    </label>

                    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={loading} className="rounded-xl bg-[#D08B4C] px-5 py-3 text-white hover:bg-[#c57b37] disabled:opacity-60">
                            {loading ? 'Зберігаємо…' : 'Створити товар'}
                        </button>
                        <button type="button" onClick={() => router.push('/admin/products')} className="rounded-xl border border-neutral-300 px-5 py-3 text-neutral-700 hover:bg-neutral-100">Скасувати</button>
                    </div>

                    {metaLoading && <div className="text-xs text-neutral-500">Завантажуємо підказки…</div>}
                </form>
            </div>

            {/* ДІАЛОГ про дублікат */}
            {dup && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setDup(null)} />
                    <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900">Такий продукт вже існує</h3>
                                <p className="mt-1 text-sm text-neutral-600">
                                    Запис з такими полями вже є в базі. Ви можете відредагувати існуючий товар.
                                </p>
                                {dup.id && <p className="mt-1 text-xs text-neutral-500">ID: {dup.id}</p>}
                            </div>
                            <button onClick={() => setDup(null)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500" aria-label="Закрити">✕</button>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDup(null)}
                                className="rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50"
                            >
                                Закрити
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (dup.id) window.location.href = `/admin/products?edit=${dup.id}`
                                    else window.location.href = '/admin/products'
                                }}
                                className="rounded-xl bg-[#D08B4C] px-4 py-2 text-sm text-white hover:bg-[#c57b37]"
                            >
                                Редагувати продукт
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

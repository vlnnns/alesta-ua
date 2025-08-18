// src/components/admin/AdminProductsClient.tsx
'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

type Product = {
    id: number
    type: string
    thickness: number
    format: string
    grade: string
    manufacturer: string
    waterproofing: string
    price: number
    image: string
    inStock: boolean
    createdAt?: string
    updatedAt?: string
}

type Draft = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

const emptyDraft: Draft = {
    type: '',
    thickness: 0,
    format: '',
    grade: '',
    manufacturer: '',
    waterproofing: '',
    price: 0,
    image: '',
    inStock: true,
}

export default function AdminProductsClient() {
    const [items, setItems] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Product | null>(null)
    const [draft, setDraft] = useState<Draft>(emptyDraft)
    const [saving, setSaving] = useState(false)

    // upload state
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // initial load
    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch('/api/admin/products?limit=500', { cache: 'no-store', signal: ac.signal })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = (await res.json()) as { items: Product[] }
                setItems(data.items ?? [])
            } catch (e: unknown) {
                if (!(e instanceof DOMException && e.name === 'AbortError')) setError('Не вдалося завантажити товари')
            } finally {
                setLoading(false)
            }
        })()
        return () => ac.abort()
    }, [])

    // suggestions
    const meta = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        return {
            types: uniq(items.map(x => x.type)),
            formats: uniq(items.map(x => x.format)),
            grades: uniq(items.map(x => x.grade)),
            manufacturers: uniq(items.map(x => x.manufacturer)),
            waterproofings: uniq(items.map(x => x.waterproofing)),
            thicknesses: uniq(items.map(x => x.thickness)).sort((a, b) => Number(a) - Number(b)),
        }
    }, [items])

    // групування за типом
    const groups = useMemo(() => {
        const map = new Map<string, Product[]>()
        for (const p of items) {
            const key = p.type || 'Без типу'
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(p)
        }
        // сортуємо в групі за товщиною, потім за форматом
        for (const [k, arr] of map) {
            arr.sort((a, b) => (a.thickness - b.thickness) || a.format.localeCompare(b.format))
            map.set(k, arr)
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'uk'))
    }, [items])

    const openCreate = () => {
        setEditing(null)
        setDraft(emptyDraft)
        setShowForm(true)
        setImageFile(null)
        if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
    }
    const openEdit = (p: Product) => {
        const { id, createdAt, updatedAt, ...rest } = p
        setEditing(p)
        setDraft(rest)
        setShowForm(true)
        setImageFile(null)
        if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
        setImagePreview(p.image || null)
    }
    const closeForm = () => {
        setShowForm(false)
        setEditing(null)
        setDraft(emptyDraft)
        setImageFile(null)
        if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
    }

    async function save() {
        try {
            setSaving(true)
            const fd = new FormData()
            fd.append('type', draft.type.trim())
            fd.append('thickness', String(Number(draft.thickness || 0)))
            fd.append('format', draft.format.trim())
            fd.append('grade', draft.grade.trim())
            fd.append('manufacturer', draft.manufacturer.trim())
            fd.append('waterproofing', draft.waterproofing.trim())
            fd.append('price', String(Number(draft.price || 0)))
            fd.append('inStock', draft.inStock ? 'on' : '')
            if (imageFile) fd.append('imageFile', imageFile)
            else if (draft.image) fd.append('imageUrl', draft.image)

            const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
            const res = await fetch(url, { method: editing ? 'PATCH' : 'POST', body: fd })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const saved = (await res.json()) as Product
            setItems(prev => (editing ? prev.map(x => (x.id === saved.id ? saved : x)) : [saved, ...prev]))
            closeForm()
        } catch {
            alert('Помилка збереження')
        } finally {
            setSaving(false)
        }
    }

    const toggleStock = async (p: Product) => {
        const next = !p.inStock
        setItems(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: next } : x))) // optimistic
        try {
            const res = await fetch(`/api/admin/products/${p.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: next }),
            })
            if (!res.ok) throw new Error()
        } catch {
            setItems(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: !next } : x)))
            alert('Не вдалося оновити статус наявності')
        }
    }

    const remove = async (p: Product) => {
        if (!confirm('Видалити товар?')) return
        const backup = items
        setItems(prev => prev.filter(x => x.id !== p.id))
        try {
            const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
        } catch {
            setItems(backup)
            alert('Не вдалося видалити')
        }
    }

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="max-w-7xl mx-auto">
                {/* header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Адмінка — Товари</h1>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 bg-[#D08B4C] text-white hover:bg-[#c57b37] shadow-sm"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        Додати товар
                    </button>
                </div>

                {loading ? (
                    <p className="text-neutral-600">Завантаження…</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="space-y-8">
                        {groups.map(([type, list]) => (
                            <section key={type}>
                                {/* секційний заголовок */}
                                <div className="mb-3 flex items-end justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">Фанера {type}</h2>
                                        <div className="text-sm text-neutral-500">{list.length} позицій</div>
                                    </div>
                                </div>

                                {/* grid карток */}
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {list.map(p => (
                                        <article
                                            key={p.id}
                                            className="group rounded-2xl border border-neutral-200 bg-white hover:shadow-sm transition overflow-hidden"
                                        >
                                            <div className="p-3 flex items-start gap-3">
                                                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                                                    <Image src={p.image} alt={p.type} fill className="object-contain" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <h3 className="truncate font-medium text-neutral-900">
                                                                {`Фанера ${p.type} ${p.thickness} мм`}
                                                            </h3>
                                                            <div className="text-xs text-neutral-500 truncate">#{p.id}</div>
                                                        </div>

                                                        {/* помітна кнопка наявності */}
                                                        <button
                                                            onClick={() => toggleStock(p)}
                                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition
                                ${p.inStock
                                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-100 border border-emerald-200'
                                                                : 'bg-rose-50 text-rose-700 ring-rose-100 border border-rose-200'
                                                            }`}
                                                            title={p.inStock ? 'Зробити “немає”' : 'Зробити “в наявності”'}
                                                        >
                                                            <span className={`h-1.5 w-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                            {p.inStock ? 'В наявності' : 'Немає'}
                                                        </button>
                                                    </div>

                                                    <div className="mt-1 text-[13px] text-neutral-600">
                                                        {p.grade} · {p.format} · {p.manufacturer}
                                                        {p.waterproofing ? `, ${p.waterproofing}` : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-3 pb-3 flex items-center justify-between">
                                                <div className="text-lg font-semibold">₴{p.price.toLocaleString('uk-UA')}</div>
                                                <div className="space-x-2">
                                                    <button
                                                        onClick={() => openEdit(p)}
                                                        className="px-3 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-sm"
                                                    >
                                                        Редагувати
                                                    </button>
                                                    <button
                                                        onClick={() => remove(p)}
                                                        className="px-3 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm"
                                                    >
                                                        Видалити
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}

                        {!groups.length && (
                            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                                Поки немає товарів
                            </div>
                        )}
                    </div>
                )}

                {/* side panel form */}
                {showForm && (
                    <div className="fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
                        <div className="absolute right-0 top-0 h-full w-[560px] max-w-[100vw] bg-white shadow-2xl p-6 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                    {editing ? 'Редагувати товар' : 'Новий товар'}
                                </h2>
                                <button onClick={closeForm} className="p-2 hover:bg-black/5 rounded-lg">✕</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Тип" value={draft.type} onChange={v => setDraft(s => ({ ...s, type: v }))} list="types" />
                                <Input label="Товщина (мм)" type="number" value={String(draft.thickness)} onChange={v => setDraft(s => ({ ...s, thickness: Number(v) }))} />
                                <Input label="Формат" value={draft.format} onChange={v => setDraft(s => ({ ...s, format: v }))} list="formats" />
                                <Input label="Сорт" value={draft.grade} onChange={v => setDraft(s => ({ ...s, grade: v }))} list="grades" />
                                <Input label="Виробник" value={draft.manufacturer} onChange={v => setDraft(s => ({ ...s, manufacturer: v }))} list="manufacturers" />
                                <Input label="Клей/вологостійкість" value={draft.waterproofing} onChange={v => setDraft(s => ({ ...s, waterproofing: v }))} list="waterproofings" />
                                <Input label="Ціна (₴)" type="number" value={String(draft.price)} onChange={v => setDraft(s => ({ ...s, price: Number(v) }))} />
                                {/* URL fallback */}
                                <Input label="Зображення (URL)" value={draft.image} onChange={v => setDraft(s => ({ ...s, image: v }))} />
                            </div>

                            <ImageUploader
                                preview={imagePreview}
                                onFile={(file, url) => {
                                    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
                                    setImageFile(file)
                                    setImagePreview(url)
                                }}
                                onClear={() => {
                                    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
                                    setImageFile(null)
                                    setImagePreview(null)
                                }}
                            />

                            <div className="mt-3">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={draft.inStock}
                                        onChange={(e) => setDraft(s => ({ ...s, inStock: e.target.checked }))}
                                    />
                                    В наявності
                                </label>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button
                                    onClick={save}
                                    disabled={saving}
                                    className="rounded-xl px-5 py-2.5 bg-[#D08B4C] hover:bg-[#c57b37] text-white disabled:opacity-60 shadow-sm"
                                >
                                    {saving ? 'Збереження…' : 'Зберегти'}
                                </button>
                                <button className="rounded-xl px-5 py-2.5 border border-neutral-200 hover:bg-neutral-50" onClick={closeForm}>
                                    Скасувати
                                </button>
                            </div>

                            {/* datalists */}
                            <datalist id="types">{meta.types.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="formats">{meta.formats.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="grades">{meta.grades.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="manufacturers">{meta.manufacturers.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="waterproofings">{meta.waterproofings.map(v => <option key={v} value={v} />)}</datalist>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

/* ---------- helpers ---------- */

function Input({
                   label,
                   value,
                   onChange,
                   type = 'text',
                   list,
               }: {
    label: string
    value: string
    onChange: (v: string) => void
    type?: 'text' | 'number'
    list?: string
}) {
    return (
        <label className="text-sm">
            <span className="block text-neutral-600 mb-1">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                list={list}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]"
            />
        </label>
    )
}

function ImageUploader({
                           preview,
                           onFile,
                           onClear,
                       }: {
    preview: string | null
    onFile: (file: File, objectUrl: string) => void
    onClear: () => void
}) {
    const [dragOver, setDragOver] = useState(false)

    return (
        <div className="mt-4">
            <span className="block text-sm text-neutral-600 mb-1">Завантажити зображення з пристрою</span>

            <label
                className={`relative flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 cursor-pointer transition
          ${dragOver ? 'bg-neutral-50 border-[#D08B4C]/60' : 'border-neutral-200 hover:bg-neutral-50'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    const file = e.dataTransfer.files?.[0]
                    if (!file) return
                    const url = URL.createObjectURL(file)
                    onFile(file, url)
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                        const f = e.currentTarget.files?.[0]
                        if (!f) return
                        const url = URL.createObjectURL(f)
                        onFile(f, url)
                    }}
                />
                <svg className="h-6 w-6 text-neutral-400" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div className="text-sm text-neutral-700">
                    Перетягніть файл або натисніть, щоб вибрати
                    <div className="text-xs text-neutral-500">PNG, JPG, WEBP до 10 МБ</div>
                </div>
            </label>

            {preview && (
                <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="preview" className="h-full w-full object-cover" />
                    </div>
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-xl px-3 py-2 border border-neutral-200 hover:bg-neutral-50 text-sm"
                    >
                        Прибрати файл
                    </button>
                </div>
            )}
        </div>
    )
}

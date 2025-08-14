// src/components/admin/AdminProductsClient.tsx  (client)
'use client'

import { useEffect, useMemo, useState } from 'react'
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

    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch('/api/admin/products?limit=200', { cache: 'no-store', signal: ac.signal })
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

    // унікальні значення для підказок
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

    const openCreate = () => {
        setEditing(null)
        setDraft(emptyDraft)
        setShowForm(true)
    }
    const openEdit = (p: Product) => {
        const { id, createdAt, updatedAt, ...rest } = p
        setEditing(p)
        setDraft(rest)
        setShowForm(true)
    }
    const closeForm = () => {
        setShowForm(false)
        setEditing(null)
        setDraft(emptyDraft)
    }

    const save = async () => {
        try {
            setSaving(true)
            const body = {
                ...draft,
                thickness: Number(draft.thickness),
                price: Number(draft.price),
            }
            const res = await fetch(editing ? `/api/admin/products/${editing.id}` : '/api/admin/products', {
                method: editing ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const saved = (await res.json()) as Product
            setItems(prev => {
                if (editing) return prev.map(x => (x.id === saved.id ? saved : x))
                return [saved, ...prev]
            })
            closeForm()
        } catch (_e: unknown) {
            alert('Помилка збереження')
        } finally {
            setSaving(false)
        }
    }

    const toggleStock = async (p: Product) => {
        const next = !p.inStock
        setItems(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: next } : x))) // оптимістично
        try {
            const res = await fetch(`/api/admin/products/${p.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: next }),
            })
            if (!res.ok) throw new Error()
        } catch {
            // відкат
            setItems(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: !next } : x)))
            alert('Не вдалося оновити статус наявності')
        }
    }

    const remove = async (p: Product) => {
        if (!confirm('Видалити товар?')) return
        const backup = items
        setItems(prev => prev.filter(x => x.id !== p.id)) // оптимістично
        try {
            const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
        } catch {
            setItems(backup)
            alert('Не вдалося видалити')
        }
    }

    return (
        <main className="px-4 sm:px-6 py-10 bg-white text-neutral-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900">Адмінка — Товари</h1>
                    <button onClick={openCreate} className="rounded-lg px-4 py-2 bg-[#D08B4C] hover:bg-[#c57b37] text-white">
                        + Додати товар
                    </button>
                </div>

                {loading ? (
                    <p className="text-neutral-600">Завантаження…</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto border rounded-xl">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="bg-neutral-50 text-neutral-600">
                            <tr>
                                <th className="text-left p-3">Фото</th>
                                <th className="text-left p-3">Назва</th>
                                <th className="text-left p-3">Параметри</th>
                                <th className="text-left p-3">Ціна</th>
                                <th className="text-left p-3">Наявність</th>
                                <th className="text-right p-3">Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-3">
                                        <div className="relative w-16 h-16 bg-neutral-100 rounded overflow-hidden">
                                            <Image src={p.image} alt={p.type} fill className="object-contain" />
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-medium text-neutral-900">{`Фанера ${p.type} ${p.thickness} мм`}</div>
                                        <div className="text-xs text-neutral-500">#{p.id}</div>
                                    </td>
                                    <td className="p-3 text-neutral-700">
                                        {p.grade} · {p.format} · {p.manufacturer}{p.waterproofing ? `, ${p.waterproofing}` : ''}
                                    </td>
                                    <td className="p-3 font-semibold text-neutral-900">₴{p.price}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => toggleStock(p)}
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                p.inStock ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'
                                            }`}
                                        >
                                            {p.inStock ? 'В наявності' : 'Немає'}
                                        </button>
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button onClick={() => openEdit(p)} className="px-3 py-1 rounded border hover:bg-black/5">
                                            Редагувати
                                        </button>
                                        <button onClick={() => remove(p)} className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50">
                                            Видалити
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr><td colSpan={6} className="p-6 text-center text-neutral-600">Поки немає товарів</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Модалка форми */}
                {showForm && (
                    <div className="fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
                        <div className="absolute right-0 top-0 h-full w-[520px] max-w-[100vw] bg-white shadow-xl p-6 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">{editing ? 'Редагувати товар' : 'Новий товар'}</h2>
                                <button onClick={closeForm} className="p-2 hover:bg-black/5 rounded">✕</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Тип" value={draft.type} onChange={v => setDraft(s => ({ ...s, type: v }))} list="types" />
                                <Input label="Товщина (мм)" type="number" value={String(draft.thickness)} onChange={v => setDraft(s => ({ ...s, thickness: Number(v) }))} />

                                <Input label="Формат" value={draft.format} onChange={v => setDraft(s => ({ ...s, format: v }))} list="formats" />
                                <Input label="Сорт" value={draft.grade} onChange={v => setDraft(s => ({ ...s, grade: v }))} list="grades" />

                                <Input label="Виробник" value={draft.manufacturer} onChange={v => setDraft(s => ({ ...s, manufacturer: v }))} list="manufacturers" />
                                <Input label="Клей/вологостійкість" value={draft.waterproofing} onChange={v => setDraft(s => ({ ...s, waterproofing: v }))} list="waterproofings" />

                                <Input label="Ціна (₴)" type="number" value={String(draft.price)} onChange={v => setDraft(s => ({ ...s, price: Number(v) }))} />
                                <Input label="Зображення (URL)" value={draft.image} onChange={v => setDraft(s => ({ ...s, image: v }))} />
                            </div>

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
                                    className="rounded-lg px-4 py-2 bg-[#D08B4C] hover:bg-[#c57b37] text-white disabled:opacity-50"
                                >
                                    {saving ? 'Збереження…' : 'Зберегти'}
                                </button>
                                <button onClick={closeForm} className="rounded-lg px-4 py-2 border hover:bg-black/5">Скасувати</button>
                            </div>

                            {/* datalists for suggestions */}
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

/* маленькі хелпери */
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
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]"
            />
        </label>
    )
}

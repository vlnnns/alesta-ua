'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/common/Breadcrumbs'

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
    createdAt?: string
    updatedAt?: string
}

export default function AdminProductsClient() {
    const [items, setItems] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

    const FALLBACK_IMAGE = '/no-image.png'

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

    const groups = useMemo(() => {
        const map = new Map<string, Product[]>()
        for (const p of items) {
            const key = p.type || 'Без типу'
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(p)
        }
        for (const [k, arr] of map) {
            arr.sort((a, b) => (a.thickness - b.thickness) || a.format.localeCompare(b.format))
            map.set(k, arr)
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'uk'))
    }, [items])

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
                <Breadcrumbs
                    items={[
                        { label: 'Головна', href: '/' },
                        { label: 'Адмінка', href: '/admin' },
                        { label: 'Товари' },
                    ]}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Адмінка — Товари</h1>

                    {/* ссылка на /admin/products/new */}
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 bg-[#D08B4C] text-white hover:bg-[#c57b37] shadow-sm"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Додати товар
                    </Link>
                </div>

                {loading ? (
                    <p className="text-neutral-600">Завантаження…</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="space-y-8">
                        {groups.map(([type, list]) => (
                            <section key={type}>
                                <div className="mb-3 flex items-end justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">Фанера {type}</h2>
                                        <div className="text-sm text-neutral-500">{list.length} позицій</div>
                                    </div>
                                </div>

                                <div className="flex flex-row flex-wrap gap-4">
                                    {list.map(p => (
                                        <article key={p.id} className="group rounded-2xl border border-neutral-200 bg-white hover:shadow-sm transition overflow-hidden">
                                            <div className="p-3 flex items-start gap-3">
                                                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                                                    <Image
                                                        src={p.image && p.image.trim() ? p.image : FALLBACK_IMAGE}
                                                        alt={p.type}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <h3 className="truncate font-medium text-neutral-900">
                                                                {`Фанера ${p.type} ${p.thickness} мм`}
                                                            </h3>
                                                            <div className="text-xs text-neutral-500 truncate">#{p.id}</div>
                                                        </div>

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
                                                    <Link
                                                        href={`/admin/products/${p.id}`} // если редактируешь через модалку — оставь кнопку/хэндлер
                                                        className="px-3 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-sm"
                                                        onClick={(e) => e.preventDefault()} // убрать, если есть отдельная страница редактирования
                                                    >
                                                        Редагувати
                                                    </Link>
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
            </div>
        </main>
    )
}

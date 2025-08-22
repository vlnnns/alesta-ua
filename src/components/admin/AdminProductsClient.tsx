'use client'

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/common/Breadcrumbs'

/* ---------- Types ---------- */
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

type Meta = {
    types: string[]
    thicknesses: number[]
    formats: string[]
    grades: string[]
    manufacturers: string[]
    waters: string[]
}

/* ---------- Helpers ---------- */
const FALLBACK_IMAGE =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO9m3WQAAAAASUVORK5CYII='

const isDefined = <T,>(v: T | null | undefined): v is T => v !== null && v !== undefined
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const normalizeType = (s: string | null | undefined) =>
    (s ?? '').replace(/^Фанера\s+/i, '').trim().replace(/\s+/g, ' ')

type Option = { v: string; t: string }
const isOption = (o: unknown): o is Option =>
    typeof o === 'object' && o !== null && 'v' in o && 't' in o

/* ---------- Component ---------- */
export default function AdminProductsClient(): ReactElement {
    const [items, setItems] = useState<Product[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Product | null>(null)
    const [saving, setSaving] = useState(false)
    const [formErr, setFormErr] = useState<string | null>(null)

    // Filters
    const [fltType, setFltType] = useState<string>('') // '' = All
    const [fltQuery, setFltQuery] = useState<string>('')
    const [fltThickness, setFltThickness] = useState<string>('')
    const [fltFormat, setFltFormat] = useState<string>('')
    const [fltGrade, setFltGrade] = useState<string>('')
    const [fltManufacturer, setFltManufacturer] = useState<string>('')
    const [fltWater, setFltWater] = useState<string>('')
    const [fltStock, setFltStock] = useState<string>('') // '', 'yes', 'no'

    // Section "show all" state
    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    // "Delete type" button state
    const [deletingType, setDeletingType] = useState<string | null>(null)

    /* ---- Load meta ---- */
    useEffect(() => {
        let ignore = false
        ;(async () => {
            try {
                const r = await fetch('/api/admin/products/meta', { cache: 'no-store' })
                if (!r.ok) return
                const m = (await r.json()) as Meta
                if (!ignore) setMeta(m)
            } catch {
                /* noop */
            }
        })()
        return () => {
            ignore = true
        }
    }, [])

    /* ---- Load ALL products (no pagination) ---- */
    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(`/api/admin/products?limit=100000`, {
                    cache: 'no-store',
                    signal: ac.signal,
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = (await res.json()) as { items: Product[] }
                setItems(data.items ?? [])
            } catch (e: unknown) {
                if (!(e instanceof DOMException && e.name === 'AbortError')) {
                    setError('Не вдалося завантажити товари')
                }
            } finally {
                setLoading(false)
            }
        })()
        return () => ac.abort()
    }, [])

    /* ---- Options for filters (meta union items) ---- */
    const options = useMemo(() => {
        const uniq = <T,>(arr: T[]) => Array.from(new Set(arr.filter(isDefined)))
        const typesFromMeta = (meta?.types ?? []).map(normalizeType).filter(isNonEmptyString)
        const typesFromItems = items.map(i => normalizeType(i.type)).filter(isNonEmptyString)
        const unionTypes = Array.from(new Set([...typesFromMeta, ...typesFromItems]))
        return {
            types: unionTypes.sort((a, b) => a.localeCompare(b, 'uk')),
            thicknesses: (meta?.thicknesses ?? uniq(items.map(i => i.thickness))).sort((a, b) => Number(a) - Number(b)),
            formats: (meta?.formats ?? uniq(items.map(i => i.format).filter(isNonEmptyString))).sort((a, b) => a.localeCompare(b, 'uk')),
            grades: (meta?.grades ?? uniq(items.map(i => i.grade).filter(isNonEmptyString))).sort((a, b) => a.localeCompare(b, 'uk')),
            manufacturers: (meta?.manufacturers ?? uniq(items.map(i => i.manufacturer).filter(isNonEmptyString))).sort((a, b) => a.localeCompare(b, 'uk')),
            waters: (meta?.waters ?? uniq(items.map(i => i.waterproofing).filter(isNonEmptyString))).sort((a, b) => a.localeCompare(b, 'uk')),
        }
    }, [items, meta])

    /* ---- Apply filters ---- */
    const filtered = useMemo(() => {
        const q = fltQuery.trim().toLowerCase()
        return items.filter(p => {
            const pt = normalizeType(p.type)
            if (fltType && pt !== fltType) return false
            if (fltThickness && p.thickness !== Number(fltThickness)) return false
            if (fltFormat && p.format !== fltFormat) return false
            if (fltGrade && p.grade !== fltGrade) return false
            if (fltManufacturer && p.manufacturer !== fltManufacturer) return false
            if (fltWater && p.waterproofing !== fltWater) return false
            if (fltStock === 'yes' && !p.inStock) return false
            if (fltStock === 'no' && p.inStock) return false

            if (q) {
                const hay = `${pt} ${p.grade} ${p.format} ${p.manufacturer} ${p.waterproofing} ${p.thickness}`.toLowerCase()
                if (!hay.includes(q)) return false
            }
            return true
        })
    }, [
        items,
        fltType,
        fltThickness,
        fltFormat,
        fltGrade,
        fltManufacturer,
        fltWater,
        fltStock,
        fltQuery,
    ])

    /* ---- Group by (normalized) type ---- */
    const allGroups = useMemo(() => {
        const baseTypes = options.types.length ? options.types : ['Без типу']
        const map = new Map<string, Product[]>()
        for (const t of baseTypes) map.set(t, [])
        for (const p of filtered) {
            const key = normalizeType(p.type) || 'Без типу'
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(p)
        }
        for (const [k, arr] of map) {
            arr.sort((a, b) => (a.thickness - b.thickness) || a.format.localeCompare(b.format))
            map.set(k, arr)
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'uk'))
    }, [filtered, options.types])

    // If one type is selected — render only its section
    const groupsToRender = useMemo(
        () => (!fltType ? allGroups : allGroups.filter(([t]) => t === fltType)),
        [allGroups, fltType],
    )

    const toggleGroup = (type: string) => {
        setExpanded(prev => {
            const next = new Set(prev)
            if (next.has(type)) next.delete(type)
            else next.add(type)
            return next
        })
    }

    /* ---- Actions ---- */
    const deleteType = async (type: string) => {
        if (!confirm(`Видалити ВЕСІ товари типу “${type}”? Дію не можна скасувати.`)) return
        setDeletingType(type)

        const backup = items
        // optimistic UI
        setItems(prev => prev.filter(p => normalizeType(p.type) !== type))
        setMeta(prev => (prev ? { ...prev, types: prev.types.filter(t => normalizeType(t) !== type) } : prev))
        if (fltType === type) setFltType('')
        setExpanded(prev => {
            const n = new Set(prev)
            n.delete(type)
            return n
        })

        try {
            const res = await fetch(`/api/admin/products/by-type?type=${encodeURIComponent(type)}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error(await res.text().catch(() => ''))
        } catch {
            setItems(backup)
            alert('Не вдалося видалити тип. Спробуйте ще раз.')
        } finally {
            setDeletingType(null)
        }
    }

    const toggleStock = async (p: Product) => {
        const next = !p.inStock
        setItems(prev => prev.map(x => (x.id === p.id ? { ...x, inStock: next } : x)))
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

    const submitEdit: React.FormEventHandler<HTMLFormElement> = async e => {
        e.preventDefault()
        if (!editing) return
        setFormErr(null)
        setSaving(true)

        const fd = new FormData(e.currentTarget)
        const payload = {
            type: normalizeType(fd.get('type') as string),
            thickness: Number(fd.get('thickness') || 0),
            format: (fd.get('format') as string).trim(),
            grade: (fd.get('grade') as string).trim(),
            manufacturer: (fd.get('manufacturer') as string).trim(),
            waterproofing: (fd.get('waterproofing') as string).trim(),
            price: Number(fd.get('price') || 0),
            inStock: fd.get('inStock') === 'on',
        }

        if (!payload.type || !payload.format || !payload.grade || !payload.manufacturer || !payload.waterproofing) {
            setFormErr('Заповніть обовʼязкові поля')
            setSaving(false)
            return
        }
        if (payload.thickness <= 0) {
            setFormErr('Товщина має бути > 0')
            setSaving(false)
            return
        }
        if (!Number.isFinite(payload.price) || payload.price < 0) {
            setFormErr('Ціна не може бути відʼємною')
            setSaving(false)
            return
        }

        try {
            const res = await fetch(`/api/admin/products/${editing.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(await res.text())
            setItems(prev => prev.map(x => (x.id === editing.id ? ({ ...x, ...payload } as Product) : x)))
            setEditing(null)
        } catch (err) {
            console.error(err)
            setFormErr('Не вдалося зберегти зміни')
        } finally {
            setSaving(false)
        }
    }

    /* ---------- Render ---------- */
    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="max-w-6xl mx-auto">
                <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Адмінка', href: '/admin' }, { label: 'Товари' }]} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Адмінка — Товари</h1>

                    <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 bg-[#D08B4C] text-white hover:bg-[#c57b37] shadow-sm">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Додати товар
                    </Link>
                </div>

                {/* Type chips */}
                {!!options.types.length && (
                    <section className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-neutral-700">Типи фанери</h3>
                            <button onClick={() => { setFltType(''); setExpanded(new Set()) }} className="text-xs text-neutral-500 hover:text-neutral-700">
                                Скинути
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => { setFltType(''); setExpanded(new Set()) }}
                                className={[
                                    'px-3 py-1.5 rounded-full border text-sm transition',
                                    !fltType ? 'border-[#D08B4C] bg-[#D08B4C]/10 text-[#8B5A2B]' : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700',
                                ].join(' ')}
                            >
                                Усі
                            </button>

                            {options.types.map(t => {
                                const active = fltType === t
                                return (
                                    <button
                                        key={t}
                                        onClick={() => {
                                            setFltType(prev => (prev === t ? '' : t))
                                            setExpanded(new Set())
                                        }}
                                        className={[
                                            'px-3 py-1.5 rounded-full border text-sm transition',
                                            active ? 'border-[#D08B4C] bg-[#D08B4C]/10 text-[#8B5A2B]' : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700',
                                        ].join(' ')}
                                        title={t}
                                    >
                                        {t}
                                    </button>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Filters */}
                <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <FilterInput label="Пошук" value={fltQuery} onChange={setFltQuery} placeholder="назва, сорт, формат…" />
                        <FilterSelect label="Товщина (мм)" value={fltThickness} onChange={setFltThickness} options={meta?.thicknesses ?? []} placeholder="Будь-яка" />
                        <FilterSelect label="Формат" value={fltFormat} onChange={setFltFormat} options={meta?.formats ?? []} placeholder="Будь-який" />
                        <FilterSelect label="Сорт" value={fltGrade} onChange={setFltGrade} options={meta?.grades ?? []} placeholder="Будь-який" />
                        <FilterSelect label="Виробник" value={fltManufacturer} onChange={setFltManufacturer} options={meta?.manufacturers ?? []} placeholder="Будь-який" />
                        <FilterSelect label="Клей/вологостійкість" value={fltWater} onChange={setFltWater} options={meta?.waters ?? []} placeholder="Будь-який" />
                        <FilterSelect
                            label="Наявність"
                            value={fltStock}
                            onChange={setFltStock}
                            options={[{ v: 'yes', t: 'В наявності' }, { v: 'no', t: 'Немає' }]}
                            placeholder="Усі"
                        />
                    </div>

                    <div className="mt-3">
                        <button
                            onClick={() => {
                                setFltType('')
                                setFltQuery('')
                                setFltThickness('')
                                setFltFormat('')
                                setFltGrade('')
                                setFltManufacturer('')
                                setFltWater('')
                                setFltStock('')
                                setExpanded(new Set())
                            }}
                            className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                        >
                            Скинути фільтри
                        </button>
                    </div>
                </section>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {/* Sections */}
                <div className="space-y-8">
                    {groupsToRender.map(([type, list]) => {
                        const isOpen = expanded.has(type)
                        const visible = isOpen ? list : list.slice(0, 4)

                        return (
                            <section key={type}>
                                <div className="mb-3 flex items-end justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">{type}</h2>
                                        <div className="text-sm text-neutral-500">{list.length} позицій</div>
                                    </div>

                                    <button
                                        onClick={() => deleteType(type)}
                                        disabled={deletingType === type}
                                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60 text-sm"
                                        title="Видалити всі позиції цього типу"
                                    >
                                        {deletingType === type ? 'Видалення…' : 'Видалити тип'}
                                    </button>
                                </div>

                                {list.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-neutral-200 bg-white/50 px-4 py-6 text-sm text-neutral-500">
                                        Немає позицій у вибірці (змініть фільтри)
                                    </div>
                                ) : (
                                    <div className="flex flex-row flex-wrap gap-6">
                                        {visible.map(p => {
                                            const cleanType = normalizeType(p.type)
                                            return (
                                                <article
                                                    key={p.id}
                                                    className="group flex flex-col justify-between w-92 h-44 rounded-2xl border border-neutral-200 bg-white hover:shadow-sm transition overflow-hidden"
                                                >
                                                    <div className="p-3 flex items-start gap-3">
                                                        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                                                            <Image
                                                                src={p.image && p.image.trim() ? p.image : FALLBACK_IMAGE}
                                                                alt={cleanType || p.type}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <h3 className="truncate font-medium text-neutral-900">{`${cleanType} ${p.thickness} мм`}</h3>
                                                                    <div className="text-xs text-neutral-500 truncate">#{p.id}</div>
                                                                </div>

                                                                <button
                                                                    onClick={() => toggleStock(p)}
                                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[8px] font-medium ring-1 transition ${
                                                                        p.inStock
                                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                            : 'bg-rose-50 text-rose-700  border border-rose-200'
                                                                    }`}
                                                                    title={p.inStock ? 'Зробити “немає”' : 'Зробити “в наявності”'}
                                                                >
                                                                    {p.inStock ? 'В наявності' : 'Немає'}
                                                                </button>
                                                            </div>

                                                            <div className="mt-1 text-[13px] text-neutral-600">
                                                                {p.grade} · {p.format} · {p.manufacturer}
                                                                {p.waterproofing ? `, ${p.waterproofing}` : ''}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="px-3 pb-3 flex items-center justify-between mt-auto">
                                                        <div className="text-lg font-semibold">₴{p.price.toLocaleString('uk-UA')}</div>
                                                        <div className="space-x-2">
                                                            <button onClick={() => setEditing(p)} className="px-3 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-sm">
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
                                            )
                                        })}
                                    </div>
                                )}

                                {list.length > 4 && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => toggleGroup(type)}
                                            className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-sm"
                                        >
                                            {isOpen ? 'Згорнути' : `Показати всі (${list.length - 4} ще)`}
                                        </button>
                                    </div>
                                )}
                            </section>
                        )
                    })}

                    {!groupsToRender.length && !loading && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                            Поки немає товарів
                        </div>
                    )}
                </div>
            </div>

            {/* Edit modal */}
            {editing && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
                    <div className="absolute right-0 top-0 h-full w-[560px] max-w-[100vw] bg-white shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Редагувати товар #{editing.id}</h2>
                            <button onClick={() => setEditing(null)} className="p-2 hover:bg-black/5 rounded-lg" aria-label="Закрити">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="grid grid-cols-2 gap-4">
                            <Field label="Тип" name="type" defaultValue={normalizeType(editing.type)} />
                            <Field label="Товщина (мм)" name="thickness" type="number" defaultValue={String(editing.thickness)} />
                            <Field label="Формат" name="format" defaultValue={editing.format} />
                            <Field label="Сорт" name="grade" defaultValue={editing.grade} />
                            <Field label="Виробник" name="manufacturer" defaultValue={editing.manufacturer} />
                            <Field label="Клей/вологостійкість" name="waterproofing" defaultValue={editing.waterproofing} />
                            <Field label="Ціна (₴)" name="price" type="number" defaultValue={String(editing.price)} />

                            <div className="col-span-2 mt-2">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input name="inStock" type="checkbox" defaultChecked={editing.inStock} className="h-4 w-4" />
                                    В наявності
                                </label>
                            </div>

                            {formErr && (
                                <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formErr}
                                </div>
                            )}

                            <div className="col-span-2 mt-2 flex gap-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl px-5 py-2.5 bg-[#D08B4C] hover:bg-[#c57b37] text-white disabled:opacity-60 shadow-sm"
                                >
                                    {saving ? 'Збереження…' : 'Зберегти'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="rounded-xl px-5 py-2.5 border border-neutral-200 hover:bg-neutral-50"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

/* ---------- UI helpers (typed) ---------- */

function Field({
                   label,
                   name,
                   defaultValue,
                   type = 'text',
               }: {
    label: string
    name: string
    defaultValue?: string
    type?: 'text' | 'number'
}): ReactElement {
    return (
        <label className="text-sm">
            <span className="block text-neutral-600 mb-1">{label}</span>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]"
            />
        </label>
    )
}

function FilterInput({
                         label,
                         value,
                         onChange,
                         placeholder,
                     }: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
}): ReactElement {
    return (
        <label className="text-sm">
            <span className="block text-neutral-600 mb-1">{label}</span>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]"
            />
        </label>
    )
}

function FilterSelect({
                          label,
                          value,
                          onChange,
                          options,
                          placeholder,
                      }: {
    label: string
    value: string
    onChange: (v: string) => void
    options: (string | number)[] | Option[]
    placeholder?: string
}): ReactElement {
    const normalized: Option[] =
        (options as unknown[]).length > 0 && isOption((options as unknown[])[0])
            ? (options as Option[])
            : (options as (string | number)[]).map(o => ({ v: String(o), t: String(o) }))

    return (
        <label className="text-sm">
            <span className="block text-neutral-600 mb-1">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-neutral-200 bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]"
                >
                    <option value="">{placeholder ?? 'Усі'}</option>
                    {normalized.map(opt => (
                        <option key={opt.v} value={opt.v}>
                            {opt.t}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.92 1.18l-4.17 3.3a.75.75 0 01-.92 0l-4.17-3.3a.75.75 0 01-.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </label>
    )
}

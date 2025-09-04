'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ---------- Types ---------- */
type Product = {
    id: number
    type: string
    thickness: number
    format: string
    grade: string | null
    manufacturer: string
    waterproofing: string
    price: number
    image: string | null
    inStock: boolean
}

type CreatePayload = {
    type: string
    thickness: number
    format: string
    grade: string
    manufacturer: string
    waterproofing: string
    price: number
    inStock: boolean
    image: string // "/uploads/...."
}

type MetaApi = {
    types: string[]
    formats: string[]
    grades: string[]
    manufacturers: string[]
    waters: string[]
    thicknesses: number[]
}

/* ---------- UI helpers ---------- */
const label = 'block text-sm text-neutral-600 mb-1'
const input =
    'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]'

/* ---------- Utils ---------- */
const normalizeType = (s: string) =>
    (s ?? '').replace(/^Фанера\s+/i, '').trim().replace(/\s+/g, ' ')

function normalizeUploadsPath(p?: string | null): string | null {
    if (!p) return null
    if (p.startsWith('/uploads/')) return p
    try {
        const u = new URL(p)
        return u.pathname.startsWith('/uploads/') ? u.pathname : null
    } catch {
        return null
    }
}

function sameKey(
    a: Omit<CreatePayload, 'image' | 'inStock' | 'price'> & { grade: string },
    b: Product,
) {
    const g1 = (a.grade ?? '').trim()
    const g2 = (b.grade ?? '').trim()
    return (
        normalizeType(a.type) === normalizeType(b.type) &&
        Number(a.thickness) === Number(b.thickness) &&
        (a.format ?? '').trim() === (b.format ?? '').trim() &&
        g1 === g2 &&
        (a.manufacturer ?? '').trim() === (b.manufacturer ?? '').trim()
    )
}
// utils/isAbort.ts
export function isAbort(e: unknown): boolean {
    return e instanceof DOMException && e.name === 'AbortError'
}

/* ===================================================== */

export default function NewProductPage() {
    const router = useRouter()

    const [items, setItems] = useState<Product[]>([])
    const [metaApi, setMetaApi] = useState<MetaApi | null>(null)
    const [metaLoading, setMetaLoading] = useState(true)

    // форма
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [lastUploadedPath, setLastUploadedPath] = useState<string | null>(null)

    // модалка про дублікат
    const [dupOpen, setDupOpen] = useState(false)
    const [dupExistingId, setDupExistingId] = useState<number | null>(null)
    const [pendingPayload, setPendingPayload] =
        useState<Omit<CreatePayload, 'image'> | null>(null)

    /* ---- load items + meta ---- */
    useEffect(() => {
        const ac = new AbortController()
        ;(async () => {
            try {
                setMetaLoading(true)
                const res = await fetch('/api/admin/products?limit=100000', {
                    cache: 'no-store',
                    signal: ac.signal,
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = (await res.json()) as { items: Product[] }
                setItems(data.items ?? [])
            } catch (e) {
                if (!isAbort(e)) {
                    // тут можно залогировать или показать мягкое уведомление
                    console.warn('Failed to load meta', e)
                }
            } finally {
                setMetaLoading(false)
            }
        })()
        return () => ac.abort()
    }, [])


    /* ---- build datalists (API + fallback из items) ---- */
    const meta = useMemo(() => {
        const uniq = <T,>(arr: T[]) => [...new Set(arr.filter(Boolean) as T[])]
        const fromItems = {
            types: uniq(items.map(x => x.type)),
            formats: uniq(items.map(x => x.format)),
            grades: uniq(items.map(x => x.grade ?? '')),
            manufacturers: uniq(items.map(x => x.manufacturer)),
            waters: uniq(items.map(x => x.waterproofing)),
            thicknesses: uniq(items.map(x => String(x.thickness))),
        }
        const fromApi = metaApi
            ? {
                types: metaApi.types,
                formats: metaApi.formats,
                grades: metaApi.grades,
                manufacturers: metaApi.manufacturers,
                waters: metaApi.waters,
                thicknesses: metaApi.thicknesses.map(String),
            }
            : null
        const pick = (a?: string[], b?: string[]) =>
            uniq([...(a ?? []), ...(b ?? [])])

        return {
            types: pick(fromApi?.types, fromItems.types).sort((a, b) =>
                a.localeCompare(b, 'uk'),
            ),
            formats: pick(fromApi?.formats, fromItems.formats).sort((a, b) =>
                a.localeCompare(b, 'uk'),
            ),
            grades: pick(fromApi?.grades, fromItems.grades).sort((a, b) =>
                a.localeCompare(b, 'uk'),
            ),
            manufacturers: pick(fromApi?.manufacturers, fromItems.manufacturers).sort(
                (a, b) => a.localeCompare(b, 'uk'),
            ),
            waterproofings: pick(fromApi?.waters, fromItems.waters).sort((a, b) =>
                a.localeCompare(b, 'uk'),
            ),
            thicknesses: pick(fromApi?.thicknesses, fromItems.thicknesses).sort(
                (a, b) => Number(a) - Number(b),
            ),
        }
    }, [items, metaApi])

    /* ---- network helpers ---- */
    async function uploadImage(file: File): Promise<{
        ok: boolean
        path?: string
        error?: string
    }> {
        const fd = new FormData()
        fd.append('image', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) {
            let msg = `Upload HTTP ${res.status}`
            try {
                const j = await res.json()
                if (j?.error) msg = j.error
            } catch {}
            return { ok: false, error: msg }
        }
        const data = (await res.json()) as { url: string }
        const p = normalizeUploadsPath(data?.url)
        if (!p) return { ok: false, error: 'Invalid image path' }
        return { ok: true, path: p }
    }

    async function createProduct(
        payload: CreatePayload,
        opts?: { force?: boolean },
    ) {
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, ...(opts?.force ? { force: true } : {}) }),
        })
        if (!res.ok) {
            let msg = `HTTP ${res.status}`
            let existingId: number | undefined
            try {
                const j = await res.json()
                if (j?.error) msg = j.error
                if (typeof j?.existingId === 'number') existingId = j.existingId
            } catch {}
            return { ok: false as const, error: msg, existingId }
        }
        const data = (await res.json()) as { id: number }
        return { ok: true as const, id: data.id }
    }

    /* ---- submit ---- */
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        setDupOpen(false)

        try {
            if (!file) {
                setError('Додайте файл зображення')
                setLoading(false)
                return
            }

            const f = new FormData(e.currentTarget)
            const rawThickness = String(f.get('thickness') || '').replace(',', '.')
            const thickness = Number(rawThickness)
            const price = Number(String(f.get('price') || '').replace(',', '.'))

            const core = {
                type: String(f.get('type') || '').trim(),
                thickness: Number.isFinite(thickness) ? thickness : 0,
                format: String(f.get('format') || '').trim(),
                grade: String(f.get('grade') || '').trim(),
                manufacturer: String(f.get('manufacturer') || '').trim(),
                waterproofing: String(f.get('waterproofing') || '').trim(),
                price: Number.isFinite(price) ? price : 0,
                inStock: f.get('inStock') === 'on',
            }

            // локальная проверка дубля
            const dup = items.find(p => sameKey(core, p))
            if (dup) {
                setDupExistingId(dup.id)
                setPendingPayload(core)
                setDupOpen(true)
                setLoading(false)
                return
            }

            // аплоад
            const up = await uploadImage(file)
            if (!up.ok || !up.path) {
                setError(up.error || 'Не вдалося завантажити зображення')
                setLoading(false)
                return
            }
            setLastUploadedPath(up.path)

            const payload: CreatePayload = { ...core, image: up.path }
            const res = await createProduct(payload) // без force

            // если бэк нашёл дубль — открываем модалку
            if (!res.ok && res.error === 'DUPLICATE') {
                setDupExistingId(res.existingId ?? null)
                setPendingPayload(core)
                setDupOpen(true)
                setLoading(false)
                return
            }

            setLoading(false)
            if (!res.ok) {
                setError(res.error || 'Помилка збереження')
                return
            }
            router.push('/admin/products')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Помилка збереження')
            setLoading(false)
        }
    }

    /* ---- создать несмотря на дубликат ---- */
    async function createAnyway() {
        if (!pendingPayload) {
            setDupOpen(false)
            return
        }
        setError(null)
        setLoading(true)
        try {
            // переиспользуем уже загруженный путь, чтобы не перезаливать
            let imgPath = lastUploadedPath
            if (!imgPath) {
                if (!file) {
                    setError('Додайте файл зображення')
                    setLoading(false)
                    return
                }
                const up = await uploadImage(file)
                if (!up.ok || !up.path) {
                    setError(up.error || 'Не вдалося завантажити зображення')
                    setLoading(false)
                    return
                }
                imgPath = up.path
                setLastUploadedPath(up.path)
            }

            const payload: CreatePayload = { ...pendingPayload, image: imgPath }
            const res = await createProduct(payload, { force: true })
            setLoading(false)
            if (!res.ok) {
                setError(res.error || 'Помилка збереження')
                return
            }
            setDupOpen(false)
            router.push('/admin/products')
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Помилка збереження')
            setLoading(false)
        }
    }

    /* ---------- render ---------- */
    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Додати товар</h1>
                    <Link
                        href="/admin/products"
                        className="text-neutral-400 hover:text-neutral-600 text-xl"
                        aria-label="Закрити"
                    >
                        ✖
                    </Link>
                </div>

                <form
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                    className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className={label}>
                            Тип *
                            <input name="type" className={input} list="types" required />
                        </label>

                        {/* text+datalist чтобы работало в Safari */}
                        <label className={label}>
                            Товщина (мм) *
                            <input
                                name="thickness"
                                type="text"
                                inputMode="decimal"
                                className={input}
                                list="thicknesses"
                                required
                            />
                        </label>

                        <label className={label}>
                            Формат *
                            <input name="format" className={input} list="formats" required />
                        </label>

                        <label className={label}>
                            Сорт *
                            <input name="grade" className={input} list="grades" />
                        </label>

                        <label className={label}>
                            Виробник *
                            <input
                                name="manufacturer"
                                className={input}
                                list="manufacturers"
                                required
                            />
                        </label>

                        <label className={label}>
                            Вологостійкість *
                            <input
                                name="waterproofing"
                                className={input}
                                list="waterproofings"
                                required
                            />
                        </label>

                        <label className={label}>
                            Ціна (₴) *
                            <input
                                name="price"
                                type="text"
                                inputMode="decimal"
                                className={input}
                                required
                            />
                        </label>
                    </div>

                    {/* datalists */}
                    <datalist id="types">
                        {meta.types.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>
                    <datalist id="thicknesses">
                        {meta.thicknesses.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>
                    <datalist id="formats">
                        {meta.formats.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>
                    <datalist id="grades">
                        {meta.grades.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>
                    <datalist id="manufacturers">
                        {meta.manufacturers.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>
                    <datalist id="waterproofings">
                        {meta.waterproofings.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>

                    {/* файл */}
                    <div>
                        <label className={label}>
                            Зображення (файл з ПК) *
                            <input
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                className={input}
                                required
                                onChange={e => {
                                    const f = e.currentTarget.files?.[0] || null
                                    setFile(f)
                                    setPreview(f ? URL.createObjectURL(f) : null)
                                    setLastUploadedPath(null) // новый файл → сбросить прежний путь
                                }}
                            />
                            {preview && (
                                <div className="mt-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="h-28 w-28 rounded-lg border border-neutral-200 object-cover"
                                    />
                                </div>
                            )}
                        </label>
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input name="inStock" type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-sm text-neutral-700">В наявності</span>
                    </label>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#D08B4C] px-5 py-3 text-white hover:bg-[#c57b37] disabled:opacity-60"
                        >
                            {loading ? 'Зберігаємо…' : 'Створити товар'}
                        </button>

                        <Link
                            href="/admin/products"
                            className="rounded-xl border border-neutral-300 px-5 py-3 text-neutral-700 hover:bg-neutral-100"
                        >
                            Скасувати
                        </Link>
                    </div>

                    {metaLoading && (
                        <div className="text-xs text-neutral-500">Завантажуємо підказки…</div>
                    )}
                </form>
            </div>

            {/* ----- Модалка дубликата ----- */}
            {dupOpen && (
                <div
                    className="fixed inset-0 z-50"
                    onMouseDown={() => setDupOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div
                        className="absolute left-1/2 top-1/2 w-[520px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl"
                        onMouseDown={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Схожий товар уже існує</h3>
                            <button
                                onClick={() => setDupOpen(false)}
                                className="p-2 hover:bg-black/5 rounded-lg"
                                aria-label="Закрити"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-3 text-sm">
                            <p>
                                Знайдено існуючий товар з такими ж характеристиками
                                {dupExistingId ? (
                                    <>: <span className="font-mono text-neutral-700">#{dupExistingId}</span></>
                                ) : null}
                                .
                            </p>
                            <p>Що зробити?</p>
                        </div>

                        <div className="p-4 border-t border-neutral-200 flex flex-wrap gap-2 justify-end">
                            <button
                                onClick={() => setDupOpen(false)}
                                className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50"
                            >
                                Закрити
                            </button>

                            {dupExistingId && (
                                <Link
                                    href={`/admin/products?edit=${dupExistingId}`}
                                    className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50"
                                    onClick={() => setDupOpen(false)}
                                >
                                    Редагувати існуючий
                                </Link>
                            )}

                            <button
                                onClick={createAnyway}
                                className="rounded-xl bg-[#D08B4C] px-4 py-2 text-white hover:bg-[#c57b37]"
                            >
                                Створити все одно
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

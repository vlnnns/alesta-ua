'use client'

import { useState } from 'react'
import { createProduct } from './actions'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null); setLoading(true)
        const form = new FormData(e.currentTarget)
        const res = await createProduct(form)
        setLoading(false)
        if (!res.ok) { setError(res.error ?? 'Помилка збереження'); return }
        router.push('/admin/products')
    }

    const label = 'block text-sm text-neutral-600 mb-1'
    const input = 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]'

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-2xl font-semibold">Додати товар</h1>

                <form onSubmit={onSubmit} encType="multipart/form-data" className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className={label}>Тип *<input name="type" className={input} required /></label>
                        <label className={label}>Товщина (мм) *<input name="thickness" type="number" step="0.1" className={input} required /></label>
                        <label className={label}>Формат *<input name="format" className={input} required /></label>
                        <label className={label}>Сорт *<input name="grade" className={input} required /></label>
                        <label className={label}>Виробник *<input name="manufacturer" className={input} required /></label>
                        <label className={label}>Вологостійкість *<input name="waterproofing" className={input} required /></label>
                        <label className={label}>Ціна (₴) *<input name="price" type="number" min="0" className={input} required /></label>
                    </div>

                    {/* Upload / або URL */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className={label}>
                            Зображення (файл з ПК)
                            <input
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                className={input}
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

                        <label className={label}>
                            або посилання на зображення (URL)
                            <input name="imageUrl" placeholder="https://..." className={input} />
                            <span className="mt-1 block text-xs text-neutral-500">Якщо файл вибрано — URL ігнорується</span>
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
                    </div>
                </form>
            </div>
        </main>
    )
}

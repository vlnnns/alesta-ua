'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOrder, type CheckoutPayload } from './actions'
import { useCart } from '@/components/cart/CartProvider'
import Image from 'next/image'
import Link from 'next/link'

/* ---------- helpers: phone mask & validation ---------- */

const onlyDigits = (s: string) => s.replace(/\D/g, '')

/** Нормализует к виду +380XXXXXXXXX (только цифры Украины) */
function normalizeUA(raw: string) {
    let d = onlyDigits(raw)

    // 0XXXXXXXXX  -> 380XXXXXXXXX
    if (d.startsWith('0') && d.length >= 10) d = '38' + d
    // 9XXXXXXXX -> 3809XXXXXXXX (когда пользователь набрал без +380/0)
    else if (!d.startsWith('380')) d = '380' + d

    d = d.slice(0, 12) // 380 + 9 цифр
    return '+' + d
}

function isValidUA(raw: string) {
    const n = normalizeUA(raw)
    return /^\+380\d{9}$/.test(n)
}

/** Маска при вводе: +380 (XX) XXX-XX-XX */
function formatUA(raw: string) {
    const n = normalizeUA(raw).replace('+', '') // 380XXXXXXXXX
    const tail = n.slice(3) // после 380
    let out = '+380'

    if (!tail) return out
    out += ' (' + tail.slice(0, 2)
    if (tail.length >= 2) out += ')'
    if (tail.length > 2) out += ' ' + tail.slice(2, 5)
    if (tail.length > 5) out += '-' + tail.slice(5, 7)
    if (tail.length > 7) out += '-' + tail.slice(7, 9)
    return out
}

/* ---------- компонент ---------- */

export default function CheckoutPage() {
    const router = useRouter()
    const { items, subtotal, clearCart } = useCart()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        customerName: '',
        email: '',
        phone: '+380', // старт маски
        city: '',
        address: '',
        warehouse: '',
        comment: '',
        companyName: '',
        companyCode: '',
    })

    /* ----- города (лениво из public/ua-cities.json) ----- */
    const [cities, setCities] = useState<string[]>([])
    useEffect(() => {
        // разместите файл по пути /public/ua-cities.json (см. ниже)
        fetch('/ua-cities.json')
            .then(r => r.ok ? r.json() : [])
            .then((list: string[]) => {
                if (Array.isArray(list)) {
                    const sorted = [...list].sort((a, b) => a.localeCompare(b, 'uk'))
                    setCities(sorted)
                }
            })
            .catch(() => {}) // без падений, просто не покажем список
    }, [])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        // простая фронт-валидация
        if (form.customerName.trim().length < 2) {
            setError('Вкажіть коректне імʼя та прізвище.')
            return
        }
        if (!isValidUA(form.phone)) {
            setError('Перевірте номер телефону у форматі +380XXXXXXXXX.')
            return
        }
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError('Перевірте email.')
            return
        }
        if (!form.city) {
            setError('Оберіть або введіть місто.')
            return
        }

        setLoading(true)

        const itemsPayload = items.map(it => {
            const productId = Number(it.productId)
            if (!Number.isFinite(productId)) throw new Error('Bad productId in cart')
            return {
                id: productId,
                title: it.title,
                image: it.image,
                price: it.price,
                quantity: it.quantity,
                type: it.type,
                thickness: it.thickness,
                format: it.format,
                grade: it.grade,
                manufacturer: it.manufacturer,
                waterproofing: it.waterproofing,
            }
        })

        const payload: CheckoutPayload = {
            ...form,
            phone: normalizeUA(form.phone), // нормализованный номер для бэка
            items: itemsPayload,
            total: subtotal,
        }

        const res = await submitOrder(payload)
        setLoading(false)

        if (!res.ok) {
            setError(res.error ?? 'Не вдалося оформити замовлення.')
            return
        }

        router.replace(`/checkout/success?id=${res.id}`)
    }

    const label = 'block text-sm text-neutral-600 mb-1'
    const input =
        'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30 focus:border-[#D08B4C]'

    // посчитаем цену красиво
    const subtotalFmt = useMemo(() => new Intl.NumberFormat('uk-UA').format(subtotal), [subtotal])

    return (
        <main className="px-4 sm:px-6 py-10 mt-12 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl sm:text-4xl font-semibold tracking-tight">Оформлення замовлення</h1>

                {!items.length ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-600">
                        Кошик порожній.{' '}
                        <Link href="/catalog" className="text-[#D08B4C] font-medium hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-12">
                        {/* Form */}
                        <section className="md:col-span-8 space-y-6">
                            {/* Контакти */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <h2 className="mb-4 text-lg font-semibold">Контактні дані</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className={label}>
                                        Ім’я та прізвище *
                                        <input
                                            className={input}
                                            autoComplete="name"
                                            value={form.customerName}
                                            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                            required
                                        />
                                    </label>

                                    <label className={label}>
                                        Телефон *
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            className={input}
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: formatUA(e.target.value) })}
                                            onBlur={(e) => setForm(f => ({ ...f, phone: formatUA(e.target.value) }))}
                                            onPaste={(e) => {
                                                const text = (e.clipboardData?.getData('text') || '');
                                                e.preventDefault();
                                                setForm(f => ({ ...f, phone: formatUA(text) }));
                                            }}
                                            onKeyDown={(e) => {
                                                // Разрешаем цифры, управление и символы +, (, ), -, пробел
                                                const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Home','End','Tab'];
                                                if (allowed.includes(e.key)) return;
                                                if (/[0-9+()\-\s]/.test(e.key)) return;
                                                e.preventDefault();
                                            }}
                                            placeholder="+380 (__) ___-__-__"
                                            autoComplete="tel"
                                            maxLength={19} // "+380 (XX) XXX-XX-XX"
                                            required
                                        />
                                    </label>


                                    <label className={label}>
                                        Email *
                                        <input
                                            type="email"
                                            className={input}
                                            autoComplete="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </label>

                                    {/* Місто: select як інші поля (з іконкою-стрілкою) */}
                                    <label className={label}>
                                        Місто *
                                        {cities.length > 0 ? (
                                            <div className="relative">
                                                <select
                                                    id="city"
                                                    className={`${input} appearance-none pr-10`}
                                                    value={form.city}
                                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                                    autoComplete="address-level2"
                                                    required
                                                >
                                                    <option value="">Оберіть місто…</option>
                                                    {cities.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>

                                                {/* своя стрілка, щоб select виглядав як інші інпути */}
                                                <svg
                                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
                                                    viewBox="0 0 24 24" fill="none" aria-hidden="true"
                                                >
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        ) : (
                                            <input
                                                className={input}
                                                placeholder="Почніть вводити місто"
                                                value={form.city}
                                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                                autoComplete="address-level2"
                                                required
                                            />
                                        )}
                                    </label>

                                </div>
                            </div>

                            {/* Коментар / Додатково */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                                <label className="block">
                                    <span className={label}>Коментар до замовлення</span>
                                    <textarea
                                        className={input}
                                        rows={3}
                                        value={form.comment}
                                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                    />
                                </label>
                            </div>

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
                                    {loading ? 'Оформляємо…' : 'Підтвердити замовлення'}
                                </button>
                                <Link href="/cart" className="text-[#D08B4C] hover:underline">
                                    Повернутись до кошика
                                </Link>
                            </div>
                        </section>

                        {/* Summary */}
                        <aside className="md:col-span-4">
                            <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-5">
                                <h2 className="mb-4 text-lg font-semibold">Ваше замовлення</h2>
                                <ul className="divide-y divide-neutral-200">
                                    {items.map((it) => (
                                        <li key={`${it.id}-${it.format}`} className="flex items-start gap-3 py-3">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                                                <Image src={it.image} alt={it.title} fill className="object-contain" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-medium">{it.title}</div>
                                                <div className="text-xs text-neutral-600">×{it.quantity}</div>
                                            </div>
                                            <div className="text-sm font-semibold">₴{it.price * it.quantity}</div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="my-4 h-px bg-neutral-200" />
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-600">Разом</span>
                                    <span className="text-xl font-semibold">₴{subtotalFmt}</span>
                                </div>
                            </div>
                        </aside>
                    </form>
                )}
            </div>
        </main>
    )
}

'use client'

import { Fragment, useState } from 'react'

type Delivery = 'pickup' | 'nova_poshta_warehouse' | 'nova_poshta_courier' | 'none'

type OrderItem = {
    id: number
    productId: number
    title: string
    price: number
    quantity: number
    type?: string | null
    thickness?: number | null
    format?: string | null
    grade?: string | null
    manufacturer?: string | null
    waterproofing?: string | null
    image?: string | null
}

type Order = {
    id: number
    createdAt: string | null
    updatedAt: string | null
    customerName: string
    email: string
    phone: string
    city: string
    address?: string | null
    warehouse?: string | null
    comment?: string | null
    companyName?: string | null
    companyCode?: string | null
    total: number
    deliveryMethod: Delivery
    items: OrderItem[]
}

function fmtDate(d?: string | null) {
    if (!d) return '—'
    const dt = new Date(d)
    return new Intl.DateTimeFormat('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dt)
}

function fmtUAH(n: number) {
    return new Intl.NumberFormat('uk-UA').format(n)
}

const DELIVERY_LABEL: Record<Delivery, string> = {
    pickup: 'Самовивіз',
    nova_poshta_warehouse: 'НП — відділення',
    nova_poshta_courier: 'НП — курʼєр',
    none: '—',
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
    const [open, setOpen] = useState<Record<number, boolean>>({})

    const toggle = (id: number) =>
        setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

    return (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                    <th className="px-4 py-3 text-left w-20">№</th>
                    <th className="px-4 py-3 text-left">Дата</th>
                    <th className="px-4 py-3 text-left">Клієнт</th>
                    <th className="px-4 py-3 text-left">Контакти</th>
                    <th className="px-4 py-3 text-left">Доставка</th>
                    <th className="px-4 py-3 text-right">Сума</th>
                    <th className="px-2 py-3 text-right w-12" />
                </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                {orders.map((o) => (
                    <Fragment key={o.id}>
                        {/* Рядок-«шапка» */}
                        <tr className="align-top">
                            <td className="px-4 py-3 font-medium">#{o.id}</td>
                            <td className="px-4 py-3">{fmtDate(o.createdAt)}</td>

                            <td className="px-4 py-3">
                                <div className="font-medium">{o.customerName}</div>
                                {(o.companyName || o.companyCode) && (
                                    <div className="mt-1 text-xs text-neutral-500">
                                        {o.companyName && <>Компанія: {o.companyName}<br /></>}
                                        {o.companyCode && <>Код: {o.companyCode}</>}
                                    </div>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <div>{o.phone}</div>
                                <div className="text-neutral-500">{o.email}</div>
                                <div className="mt-1 text-xs text-neutral-500">Місто: {o.city}</div>
                            </td>

                            <td className="px-4 py-3">
                                <div>{DELIVERY_LABEL[o.deliveryMethod] ?? '—'}</div>
                                {o.deliveryMethod === 'nova_poshta_warehouse' && o.warehouse && (
                                    <div className="text-xs text-neutral-500">Відділення: {o.warehouse}</div>
                                )}
                                {o.deliveryMethod === 'nova_poshta_courier' && o.address && (
                                    <div className="text-xs text-neutral-500">Адреса: {o.address}</div>
                                )}
                                {o.comment && (
                                    <div className="mt-1 text-xs text-neutral-500">Коментар: {o.comment}</div>
                                )}
                            </td>

                            <td className="px-4 py-3 text-right font-semibold">₴{fmtUAH(o.total)}</td>

                            <td className="px-2 py-3 text-right">
                                <button
                                    onClick={() => toggle(o.id)}
                                    className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50"
                                    aria-expanded={!!open[o.id]}
                                    aria-controls={`order-details-${o.id}`}
                                    title={open[o.id] ? 'Сховати' : 'Деталі'}
                                >
                                    <span>{open[o.id] ? 'Сховати' : 'Деталі'}</span>
                                    <svg
                                        className={`h-4 w-4 transition-transform ${open[o.id] ? 'rotate-180' : ''}`}
                                        viewBox="0 0 20 20" fill="currentColor"
                                    >
                                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>

                        {/* Рядок-деталі (акордеон) */}
                        {open[o.id] && (
                            <tr id={`order-details-${o.id}`} className="bg-neutral-50/40" key={`details-${o.id}`}>
                                <td colSpan={7} className="px-4 py-4">
                                    <div className="rounded-xl border border-neutral-200 bg-white">
                                        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                                            <div className="font-medium">Позиції замовлення</div>
                                            <div className="text-xs text-neutral-500">Разом: ₴{fmtUAH(o.total)}</div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead className="bg-neutral-50 text-neutral-600">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Товар</th>
                                                    <th className="px-4 py-2 text-left">Опції</th>
                                                    <th className="px-4 py-2 text-right">Ціна</th>
                                                    <th className="px-4 py-2 text-right">К-сть</th>
                                                    <th className="px-4 py-2 text-right">Сума</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-200">
                                                {o.items.map((it) => {
                                                    const sum = it.price * it.quantity
                                                    return (
                                                        <tr key={it.id}>
                                                            <td className="px-4 py-2">
                                                                <div className="font-medium">{it.title}</div>
                                                                <div className="text-xs text-neutral-500">#{it.productId}</div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="text-xs text-neutral-600 space-y-0.5">
                                                                    {it.type && <div>Тип: {it.type}</div>}
                                                                    {it.thickness != null && <div>Товщина: {it.thickness} мм</div>}
                                                                    {it.format && <div>Формат: {it.format}</div>}
                                                                    {it.grade && <div>Сорт: {it.grade}</div>}
                                                                    {it.manufacturer && <div>Виробник: {it.manufacturer}</div>}
                                                                    {it.waterproofing && <div>Вологостійкість: {it.waterproofing}</div>}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-right">₴{fmtUAH(it.price)}</td>
                                                            <td className="px-4 py-2 text-right">{it.quantity}</td>
                                                            <td className="px-4 py-2 text-right font-medium">₴{fmtUAH(sum)}</td>
                                                        </tr>
                                                    )
                                                })}
                                                {!o.items.length && (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-3 text-center text-neutral-500">
                                                            Немає позицій
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="px-4 py-3 border-t border-neutral-200 grid gap-4 md:grid-cols-3 text-xs text-neutral-600">
                                            <div>
                                                <div className="font-medium text-neutral-800 mb-1">Платник</div>
                                                <div>{o.customerName}</div>
                                                <div>{o.phone}</div>
                                                <div>{o.email}</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-neutral-800 mb-1">Місто/Адреса</div>
                                                <div>Місто: {o.city}</div>
                                                {o.address && <div>Адреса: {o.address}</div>}
                                                {o.warehouse && <div>Відділення: {o.warehouse}</div>}
                                            </div>
                                            <div>
                                                <div className="font-medium text-neutral-800 mb-1">Службова</div>
                                                <div>Створено: {fmtDate(o.createdAt)}</div>
                                                <div>Оновлено: {fmtDate(o.updatedAt)}</div>
                                                <div>Метод доставки: {DELIVERY_LABEL[o.deliveryMethod] ?? '—'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </Fragment>
                ))}

                {!orders.length && (
                    <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                            Поки що немає замовлень
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}

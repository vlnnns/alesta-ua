'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
    types: string[]
    activeType: string
    allLabel?: string
}

export default function TypeFilterPicker({ types, activeType, allLabel = 'Усі' }: Props) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const btnRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const go = (next: string) => {
        const params = new URLSearchParams(searchParams?.toString() ?? '')
        if (next === 'all') params.delete('type')
        else params.set('type', next)
        router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false })
        setOpen(false)
    }

    // Закриття по кліку поза меню
    useEffect(() => {
        if (!open) return
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node
            if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
            setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        document.addEventListener('mousedown', onDown)
        window.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onDown)
            window.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <div className="relative inline-block">
            {/* Кнопка-чип */}
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen(v => !v)}
                className={[
                    'cursor-pointer inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full',
                    'bg-black/5 text-neutral-700 hover:bg-black/10',
                    'ring-1 ring-transparent hover:ring-[#D08B4C]/25 transition',
                ].join(' ')}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls="type-filter-menu"
                title="Вибрати тип"
            >
                <span>Тип:</span>
                <strong className="font-medium text-neutral-900">
                    {activeType === 'all' ? allLabel : activeType}
                </strong>
                <span
                    className={[
                        'text-neutral-400 transition-transform duration-200',
                        open ? 'rotate-180' : '',
                    ].join(' ')}
                >
          ▾
        </span>
            </button>

            {/* Дропдаун під кнопкою */}
            {open && (
                <div
                    ref={menuRef}
                    id="type-filter-menu"
                    role="listbox"
                    className={[
                        'absolute z-30 mt-2 w-64 sm:w-80',
                        'left-0', // або 'right-0' якщо треба вирівняти по правому краю
                        'rounded-2xl border border-neutral-200 bg-white shadow-lg',
                        'p-3',
                    ].join(' ')}
                >
                    <div className="grid grid-cols-2 gap-2 max-h-72 overflow-auto">
                        <button
                            type="button"
                            onClick={() => go('all')}
                            className={[
                                'cursor-pointer w-full rounded-xl px-3 py-2 border text-left text-xs transition',
                                activeType === 'all'
                                    ? 'border-[#D08B4C] bg-[#FFF4E6] text-neutral-900'
                                    : 'border-neutral-200 hover:border-neutral-300 bg-white',
                            ].join(' ')}
                        >
                            {allLabel}
                        </button>

                        {types.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => go(t)}
                                className={[
                                    'cursor-pointer w-full rounded-xl px-3 py-2 border text-left text-xs transition',
                                    activeType === t
                                        ? 'border-[#D08B4C] bg-[#FFF4E6] text-neutral-900'
                                        : 'border-neutral-200 hover:border-neutral-300 bg-white',
                                ].join(' ')}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

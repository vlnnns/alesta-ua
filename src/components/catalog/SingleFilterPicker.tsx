// components/catalog/SingleFilterPicker.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Option = string | number

export default function SingleFilterPicker({
                                               param, label, allLabel = 'Усі', options,
                                           }: {
    param: string
    label: string
    allLabel?: string
    options: Option[]
}) {
    const [open, setOpen] = useState(false)
    const [alignRight, setAlignRight] = useState(false)
    const [twoCols, setTwoCols] = useState(false)
    const [menuMaxW, setMenuMaxW] = useState(640) // обмеження, щоб не виходило за край

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const btnRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const active = searchParams?.get(param) ?? 'all'

    const go = (next: Option | 'all') => {
        const params = new URLSearchParams(searchParams?.toString() ?? '')
        if (next === 'all') params.delete(param)
        else params.set(param, String(next))
        router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false })
        setOpen(false)
    }

    // авто-позиціювання та колонки
    useEffect(() => {
        if (!open) return

        const recompute = () => {
            const margin = 16 // безпечний відступ від країв
            const vw = window.innerWidth
            setTwoCols(vw < 820)

            const maxW = Math.min(vw - margin * 2, 640)
            setMenuMaxW(maxW)

            const btn = btnRef.current
            const menu = menuRef.current
            if (!btn) return
            const btnRect = btn.getBoundingClientRect()
            // оцінимо фактичну ширину меню
            const naturalW = Math.min(menu?.scrollWidth ?? maxW, maxW)
            // якщо правий край виходить за межу — притискаємо до правого
            const wouldOverflowRight = btnRect.left + naturalW > vw - margin
            setAlignRight(wouldOverflowRight)
        }

        recompute()
        const onResize = () => recompute()
        window.addEventListener('resize', onResize)
        // другий прогін після рендера елементів
        requestAnimationFrame(recompute)

        return () => window.removeEventListener('resize', onResize)
    }, [open, options])

    // закриття поза меню / Esc
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
            {/* chip */}
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
                aria-controls={`${param}-filter-menu`}
                title={`Вибрати ${label.toLowerCase()}`}
            >
                <span>{label}</span>
                <strong className="font-medium text-neutral-900">
                    {active === 'all' ? allLabel : active}
                </strong>
                <span className={['text-neutral-400 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}>
          ▾
        </span>
            </button>

            {/* dropdown */}
            {open && (
                <div
                    ref={menuRef}
                    id={`${param}-filter-menu`}
                    role="listbox"
                    className={[
                        'absolute z-30 mt-2 rounded-2xl border border-neutral-200 bg-white shadow-lg p-3',
                        alignRight ? 'right-0 left-auto' : 'left-0',
                        'w-fit',
                    ].join(' ')}
                    style={{
                        minWidth: btnRef.current?.offsetWidth, // не вужче за чип
                        maxWidth: menuMaxW,                     // не ширше екрана
                    }}
                >
                    {/* 1 або 2 колонки, ширина колонок — по вмісту */}
                    <div
                        className="grid gap-2 max-h-80 overflow-auto"
                        style={{ gridTemplateColumns: twoCols ? 'repeat(2, auto)' : 'repeat(1, auto)' }}
                    >
                        <button
                            type="button"
                            onClick={() => go('all')}
                            className={[
                                'cursor-pointer rounded-xl px-3 py-2 border text-left text-xs transition whitespace-nowrap',
                                active === 'all'
                                    ? 'border-[#D08B4C] bg-[#FFF4E6] text-neutral-900'
                                    : 'border-neutral-200 hover:border-neutral-300 bg-white',
                            ].join(' ')}
                        >
                            {allLabel}
                        </button>

                        {options.map((opt) => {
                            const v = String(opt)
                            const isActive = active === v
                            return (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => go(opt)}
                                    className={[
                                        'cursor-pointer rounded-xl px-3 py-2 border text-left text-xs transition whitespace-nowrap',
                                        isActive
                                            ? 'border-[#D08B4C] bg-[#FFF4E6] text-neutral-900'
                                            : 'border-neutral-200 hover:border-neutral-300 bg-white',
                                    ].join(' ')}
                                >
                                    {v}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

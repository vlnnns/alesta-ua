'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import CartButton from '@/components/cart/CartButton'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setOpen(false) }, [pathname])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
        document.addEventListener('keydown', onKey)
        window.addEventListener('resize', onResize)
        const prev = document.body.style.overflow
        document.body.style.overflow = open ? 'hidden' : prev || ''
        return () => {
            document.removeEventListener('keydown', onKey)
            window.removeEventListener('resize', onResize)
            document.body.style.overflow = prev
        }
    }, [open])

    return (
        <>
            {/* HEADER */}
            <header
                className={`fixed top-0 left-0 w-full z-40 text-white transition-all duration-300 ${
                    scrolled ? 'bg-black/60 backdrop-blur-md' : 'bg-black/90 backdrop-blur-sm'
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2 relative">
                    <Link href="/" className="text-xl font-bold" aria-label="Home">
                        <Image src="/logo.png" alt="logo" width={120} height={32} priority />
                    </Link>

                    <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex space-x-8 text-sm font-medium">
                        <Link href="/catalog">Каталог</Link>
                        <Link href="/about">Про нас</Link>
                        <Link href="/blog">Блог</Link>
                        <Link href="/contacts">Контакти</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <CartButton />

                        <button
                            type="button"
                            className="cursor-pointer md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 active:bg-white/15 transition"
                            aria-label="Меню"
                            aria-haspopup="menu"
                            aria-controls="mobile-menu"
                            aria-expanded={open}
                            onClick={() => setOpen(v => !v)}
                        >
                            {!open ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE MENU LAYER — СОСЕДЬ С ХЕДЕРОМ (НЕ внутри header) */}
            <div
                className={`md:hidden fixed inset-0 z-[1000] ${open ? '' : 'pointer-events-none'}`}
                aria-hidden={!open}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                        open ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => setOpen(false)}
                    // страховка от всплытия
                    onMouseDown={(e) => e.stopPropagation()}
                />

                {/* Sheet */}
                <div
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    className={`absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-neutral-900/95 backdrop-blur-xl border-l border-white/10
                      transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                        <span className="text-sm text-white/70">Меню</span>
                        <button
                            type="button"
                            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-md text-white border border-white/15 bg-white/5 hover:bg-white/10"
                            onClick={() => setOpen(false)}
                            aria-label="Закрити меню"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <nav className="px-5 py-4 space-y-1 text-base">
                        <Link href="/catalog" className="block rounded-lg px-3 py-3 text-white hover:bg-white/10">Каталог</Link>
                        <Link href="/about" className="block rounded-lg px-3 py-3 text-white hover:bg-white/10">Про нас</Link>
                        <Link href="/blog" className="block rounded-lg px-3 py-3 text-white hover:bg-white/10">Блог</Link>
                        <Link href="/contacts" className="block rounded-lg px-3 py-3 text-white hover:bg-white/10">Контакти</Link>
                    </nav>

                    <div className="mt-auto px-5 py-5 text-xs text-white/50">© {new Date().getFullYear()} ALESTA UA</div>
                </div>
            </div>
        </>
    )
}

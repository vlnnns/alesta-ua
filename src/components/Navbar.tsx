'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CartButton from '@/components/cart/CartButton'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 w-full z-40 text-white transition-all duration-300
        ${scrolled
                ? 'bg-black/60 backdrop-blur-lg shadow-lg border-b border-white/10'
                : 'bg-black/40 backdrop-blur-md border-b border-white/10'}
      `}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold z-10" aria-label="Home">
                    <Image src="/logo.png" alt="logo" width={120} height={32} priority />
                </Link>

                {/* Nav Links */}
                <nav className="cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex space-x-8 text-sm font-medium">
                    <Link href="/catalog">Каталог</Link>
                    <Link href={{ pathname: '/', hash: 'partners' }}>Про нас</Link>
                    <Link href="/blog">Блог</Link>
                    <Link href={{ pathname: '/', hash: 'contacts' }}>Контакти</Link>
                </nav>

                {/* Cart */}
                <CartButton />
            </div>
        </header>
    )
}

export default Navbar

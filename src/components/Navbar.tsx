'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import CartButton from "@/components/cart/CartButton";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50) // менять 50px при необходимости
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`w-full fixed top-0 left-0 z-40 transition-colors duration-300 ${
                scrolled ? 'bg-black text-white shadow-lg' : 'bg-transparent text-white'
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold z-10">
                    <img src="/logo.png" alt="logo" className="h-8"/>
                </Link>

                {/* Nav Links (centered absolutely) */}
                <nav
                    className="cursor-pointer absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex space-x-8 text-sm font-medium">
                    <Link href="/catalog">Каталог</Link>
                    <Link href={{pathname: '/', hash: 'partners'}}>Про нас</Link>
                    <Link href="/blog">Блог</Link>
                    <Link href={{pathname: '/', hash: 'contacts'}}>Контакти</Link>
                </nav>

                {/* Cart Icon */}

                <CartButton/>

            </div>
        </header>
    )
}

export default Navbar

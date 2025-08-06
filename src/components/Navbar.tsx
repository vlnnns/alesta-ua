'use client'

import Link from 'next/link'
import { HiOutlineShoppingBag } from 'react-icons/hi2'

const Navbar = () => {
    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-transparent text-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative">

                {/* Logo */}
                <Link href="/" className="text-xl font-bold z-10">
                    <img src="/logo.png" alt="logo" className="h-8" />
                </Link>

                {/* Nav Links (centered absolutely) */}
                <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex space-x-8 text-sm font-medium">
                    <Link href="/">Каталог</Link>
                    <Link href="/">Про нас</Link>
                    <Link href="/">Блог</Link>
                    <Link href="/">Контакти</Link>
                </nav>

                {/* Cart Icon */}
                <button className="text-2xl z-10">
                    <HiOutlineShoppingBag />
                </button>
            </div>
        </header>
    )
}

export default Navbar

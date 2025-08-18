'use client'

import { usePathname } from 'next/navigation'
import { CartProvider } from '@/components/cart/CartProvider'
import CartDrawer from '@/components/cart/CartDrawer'

export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login/')

    // На сторінці логіну — БЕЗ провайдерів/кошика
    if (isAuthPage) return <>{children}</>

    return (
        <CartProvider>
            {children}
            <CartDrawer />
        </CartProvider>
    )
}

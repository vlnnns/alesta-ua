// app/blog/layout.tsx
import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar' // <- ваш існуючий navbar
import Footer from '@/components/Footer'

export default function BlogLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            {/* Якщо Navbar fixed, дайте відступ зверху під його висоту */}
            <div className="pt-[72px]">{children}</div>
            <Footer />
        </>
    )
}

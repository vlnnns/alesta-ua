// app/blog/page.tsx
import Link from 'next/link'
import BlogSection from "@/components/blog/BlogSection";

export const metadata = {
    title: 'Блог',
    description: 'Ідеї, DIY та натхнення з фанерою',
}

export default function BlogPage() {
    return (
        <main className="py-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Хлібні крошки */}
                <nav className="mb-6 text-sm text-neutral-500 flex gap-2 items-center px-6">
                    <Link href="/" className="hover:underline cursor-pointer">Головна</Link>
                    <span>/</span>
                    <span className="text-neutral-800">Блог</span>
                </nav>

                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 text-neutral-800 px-6">
                    Блог
                </h1>

                <BlogSection />

            </div>
        </main>
    )
}

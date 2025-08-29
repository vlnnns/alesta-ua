// app/blog/page.tsx
import Link from 'next/link'
import BlogSectionServer from '@/components/blog/BlogSectionServer'

export const metadata = {
    title: 'Блог',
    description: 'Ідеї, DIY та натхнення з фанерою',
}

// чтобы не залип старый 404/ISR
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
    return (
        <main className="py-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <nav className="mb-6 text-sm text-neutral-500 flex gap-2 items-center px-6">
                    <Link href="/" className="hover:underline">Головна</Link>
                    <span>/</span>
                    <span className="text-neutral-800">Блог</span>
                </nav>

                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 text-neutral-800 px-6">
                    Блог
                </h1>

                <BlogSectionServer />
            </div>
        </main>
    )
}

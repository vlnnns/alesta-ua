// app/blog/page.tsx
import Link from 'next/link'
import BlogCard from '@/components/blog/BlogCard'
import { blogPosts } from '@/data/blog'

export const metadata = {
    title: 'Блог',
    description: 'Ідеї, DIY та натхнення з фанерою',
}

export default function BlogPage() {
    const [hero, ...rest] = blogPosts

    return (
        <main className="px-4 sm:px-6 py-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Хлебные крошки */}
                <nav className="mb-6 text-sm text-neutral-500 flex gap-2 items-center">
                    <Link href="/" className="hover:underline">Головна</Link>
                    <span>/</span>
                    <span className="text-neutral-800">Блог</span>
                </nav>

                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 text-neutral-800">Блог</h1>

                {/* Hero зверху */}
                <div className="mb-10">
                    <BlogCard post={hero} variant="hero" />
                </div>

                {/* Решта постів однакової ширини */}
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                    {rest.map((p, i) => (
                        <BlogCard key={p.id} post={p} variant={i % 2 ? 'dark' : 'light'} />
                    ))}
                </div>
            </div>
        </main>
    )
}

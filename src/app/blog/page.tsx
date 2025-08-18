// app/blog/page.tsx
import Link from 'next/link'
import BlogCard from '@/components/blog/BlogCard'
import { blogPosts } from '@/data/blog'

export const metadata = {
    title: 'Блог',
    description: 'Ідеї, DIY та натхнення з фанерою',
}

export default function BlogPage() {
    return (
        <main className="px-4 sm:px-6 py-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Хлібні крошки */}
                <nav className="mb-6 text-sm text-neutral-500 flex gap-2 items-center">
                    <Link href="/" className="hover:underline cursor-pointer">Головна</Link>
                    <span>/</span>
                    <span className="text-neutral-800">Блог</span>
                </nav>

                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 text-neutral-800">
                    Блог
                </h1>

                {/* Bento / Masonry: 1 колонка мобільні, 2 колонки з md (≥768px) */}
                <div className="columns-1 md:columns-2 gap-6 [column-fill:_balance]">
                    {blogPosts.map((p, i) => (
                        <div key={p.id} className="mb-6 break-inside-avoid-column [break-inside:avoid]">
                            <BlogCard
                                post={p}
                                variant={i === 0 ? 'hero' : i % 2 ? 'dark' : 'light'}
                                // за бажанням можна трохи зменшити висоту hero всередині колонок:
                                // className={i === 0 ? 'h-[520px] min-h-[520px] md:h-[560px] md:min-h-[560px]' : ''}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

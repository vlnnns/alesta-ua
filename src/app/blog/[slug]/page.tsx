// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/data/blog'

export function generateStaticParams() {
    return blogPosts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = blogPosts.find(p => p.slug === params.slug)
    return {
        title: post ? post.title : 'Блог',
        description: post?.excerpt,
    }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = blogPosts.find(p => p.slug === params.slug)
    if (!post) return notFound()

    return (
        <article className="px-4 sm:px-6 py-12 text-neutral-800">
            <div className="max-w-7xl mx-auto">
                {/* Хлебные крошки */}
                <nav className="mb-6 text-sm text-neutral-500 flex gap-2 items-center">
                    <Link href="/" className="hover:underline cursor-pointer">Головна</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:underline cursor-pointer">Блог</Link>
                    <span>/</span>
                    <span className="text-neutral-800">{post.title}</span>
                </nav>

                <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-black/5">
          {post.category}
        </span>
                <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">{post.title}</h1>
                <p className="mt-1 text-neutral-600">{new Date(post.publishedAt).toLocaleDateString()}</p>

                <div className="relative mt-8 w-full aspect-[16/9] overflow-hidden rounded-2xl h-[250px]">
                    <Image
                        src="/diy1.png"
                        alt="DIY cover"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div
                    className="prose prose-neutral mt-8 max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                />
            </div>
        </article>
    )
}

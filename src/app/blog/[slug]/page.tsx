// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
    const rows = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true },
        take: 200,
    })
    return rows.map(r => ({ slug: r.slug }))
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const decoded = decodeURIComponent(slug)
    const post = await prisma.blogPost.findUnique({
        where: { slug: decoded },
        select: { title: true, excerpt: true },
    })
    if (!post) return { title: 'Блог' }
    return { title: post.title, description: post.excerpt ?? undefined }
}

export default async function BlogPostPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const decoded = decodeURIComponent(slug)

    const post = await prisma.blogPost.findUnique({ where: { slug: decoded } })
    if (!post || !post.published) return notFound()

    return (
        <article className="px-4 sm:px-6 py-12 text-neutral-800">
            <div className="max-w-7xl mx-auto">
                <nav className="mb-6 text-sm text-neutral-500 flex gap-2 items-center">
                    <Link href="/" className="hover:underline">Головна</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:underline">Блог</Link>
                    <span>/</span>
                    <span className="text-neutral-800">{post.title}</span>
                </nav>

                {post.category && (
                    <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-black/5">
            {post.category}
          </span>
                )}
                <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">{post.title}</h1>
                {post.publishedAt && (
                    <p className="mt-1 text-neutral-600">
                        {new Date(post.publishedAt).toLocaleDateString('uk-UA')}
                    </p>
                )}

                <div className="relative mt-8 w-full h-[300px] overflow-hidden rounded-2xl">
                    <Image
                        src={post.coverImage || '/diy1.png'}
                        alt={post.title}
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

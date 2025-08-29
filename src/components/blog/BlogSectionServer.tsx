import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import BlogCard from '@/components/blog/BlogCard'

export const revalidate = 0

export default async function BlogSectionServer() {
    // Сначала featured опубликованные, потом обычные — по дате
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }],
        take: 60,
    })

    if (!posts.length) return null

    const [hero, ...rest] = posts

    return (
        <section className="px-4 sm:px-6 py-10 bg-white">
            <div className="mx-auto max-w-7xl">
                {/* HERO */}
                <div className="mb-6">
                    <Link href={`/blog/${hero.slug}`} className="group relative block overflow-hidden rounded-md min-h-[320px] sm:min-h-[420px] md:min-h-[520px]">
                        <Image
                            src={hero.coverImage || '/diy1.png'}
                            alt={hero.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors" />
                        <div className="absolute left-6 right-6 bottom-6 text-white">
                            {hero.category && (
                                <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                  {hero.category}
                </span>
                            )}
                            <h3 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight">{hero.title}</h3>
                        </div>
                    </Link>
                </div>

                {/* Masonry: колонки + запрет разрыва карточек */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                    {rest.map(p => (
                        <article key={p.id} className="mb-6 break-inside-avoid">
                            {/* можно использовать твой BlogCard в variant="light"/"dark" */}
                            <Link
                                href={`/blog/${p.slug}`}
                                className="relative block rounded-md bg-[#F5F5F5] p-0 overflow-hidden"
                            >
                                <div className="relative w-full aspect-[16/10]">
                                    <Image
                                        src={p.coverImage || '/diy1.png'}
                                        alt={p.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-5">
                                    {p.category && (
                                        <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-black/5">
                      {p.category}
                    </span>
                                    )}
                                    <h3 className="mt-3 text-lg font-semibold text-neutral-800">{p.title}</h3>
                                    <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.excerpt}</p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

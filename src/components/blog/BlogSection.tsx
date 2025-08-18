'use client'

import BlogCard from '@/components/blog/BlogCard'
import { blogPosts } from '@/data/blog'

export default function BlogSection() {
    const [hero, light, dark] = blogPosts

    return (
        <section className="px-4 sm:px-6 py-10 bg-white">
            <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3 md:auto-rows-[260px]">
                <div className="md:col-span-2 md:row-span-2">
                    <BlogCard post={hero} variant="hero" />
                </div>

                <div>
                    <BlogCard post={light} variant="light" />
                </div>

                <div>
                    <BlogCard post={dark} variant="dark" />
                </div>
            </div>
        </section>
    )
}

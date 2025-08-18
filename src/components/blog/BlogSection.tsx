'use client'

import BlogCard from '@/components/blog/BlogCard'         // value import (НЕ import type)
import { blogPosts } from '@/data/blog'                   // value import

export default function BlogSection() {
    // возьмём 3 поста для секции: большой слева + две карточки справа
    const [hero, light, dark] = blogPosts

    return (
        <section className="px-4 sm:px-6 py-10 bg-white">
            <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2">
                <div className="">
                    <BlogCard post={hero} variant="hero" />
                </div>

                <div className="flex flex-col gap-6">
                    <BlogCard post={light} variant="light" />
                    <BlogCard post={dark} variant="dark" />
                </div>
            </div>
        </section>
    )
}

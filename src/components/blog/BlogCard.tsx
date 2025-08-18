'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/data/blog'
import clsx from 'clsx'

type Props = {
    post: BlogPost
    variant?: 'hero' | 'light' | 'dark'
    className?: string
}

export default function BlogCard({ post, variant = 'light', className }: Props) {
    const href = `/blog/${post.slug}`

    if (variant === 'hero') {
        return (
            <Link
                href={href}
                className={clsx(
                    'relative overflow-hidden rounded-2xl block group',
                    'h-[560px] min-h-[560px]',
                    className
                )}
            >
                <div className="relative w-full h-[560px] rounded-2xl overflow-hidden">
                    <Image
                        src="/diy1.png"
                        alt="DIY cover"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>


                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition" />
                <div className="absolute left-6 bottom-6 right-6 text-white">
          <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-white/15 backdrop-blur">
            {post.category}
          </span>
                    <h3 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight">
                        {post.title}
                    </h3>
                </div>
            </Link>
        )
    }

    if (variant === 'dark') {
        return (
            <Link
                href={href}
                className={clsx(
                    'relative overflow-hidden rounded-2xl block group',
                    'h-[260px] min-h-[260px]',
                    className
                )}
            >
                <div className="relative w-full h-[560px] rounded-2xl overflow-hidden">
                    <Image
                        src="/diy1.png"
                        alt="DIY cover"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>


                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/60 transition" />
                <div className="absolute left-6 right-16 top-6 text-white">
          <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-white/15 backdrop-blur">
            {post.category}
          </span>
                </div>
                <div className="absolute left-6 right-16 bottom-6 text-white ">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="mt-2 text-sm/5 text-white/80 line-clamp-2">{post.excerpt}</p>
                </div>
                <span className="absolute right-6 bottom-6 grid h-9 w-9 place-items-center rounded-xl bg-[#D08B4C] text-white">
          ↗
        </span>
            </Link>
        )
    }

    // light
    return (
        <Link
            href={href}
            className={clsx(
                'rounded-2xl bg-[#F5F5F5] hover:shadow-md transition block',
                'p-6 relative h-[260px] min-h-[260px]',
                className
            )}
        >
      <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-black/5">
        {post.category}
      </span>
            <h3 className="mt-4 text-xl font-semibold text-neutral-800">{post.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>
            <span className="absolute right-6 bottom-6 grid h-9 w-9 place-items-center rounded-xl bg-[#D08B4C] text-white">
        ↗
      </span>
        </Link>
    )
}

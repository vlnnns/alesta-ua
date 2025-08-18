'use client'

import Link from 'next/link'
import Image from 'next/image'
import type {BlogPost} from '@/data/blog'
import clsx from 'clsx'

type Props = {
    post: BlogPost
    variant?: 'hero' | 'light' | 'dark'
    className?: string
    imageSrc?: string // опціонально; fallback нижче
}

export default function BlogCard({
                                     post,
                                     variant = 'light',
                                     className,
                                     imageSrc = '/diy1.png',
                                 }: Props) {
    const href = `/blog/${post.slug}`

    if (variant === 'hero') {
        return (
            <Link
                href={href}
                className={clsx(
                    'group relative block overflow-hidden rounded-md h-full min-h-[420px] md:min-h-[540px]',
                    'hover:shadow-xl transition-shadow',
                    className
                )}
            >
                {/* image */}
                <div className="absolute inset-0">
                    <Image src={imageSrc} alt={post.title} fill className="object-cover" priority/>
                </div>

                {/* overlay + content */}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors"/>
                <div className="absolute left-6 right-6 bottom-6 text-white">
          <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-white/15 backdrop-blur">
            {post.category}
          </span>
                    <h3 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight">{post.title}</h3>
                </div>
            </Link>
        )
    }

    if (variant === 'dark') {
        return (
            <Link
                href={href}
                className={clsx(
                    'group relative block overflow-hidden rounded-md h-full min-h-[260px]',
                    'hover:shadow-xl transition-shadow',
                    className
                )}
            >
                {/* image */}
                <div className="absolute inset-0">
                    <Image src={imageSrc} alt={post.title} fill className="object-cover"/>
                </div>

                {/* overlay + content */}
                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/60 transition-colors"/>
                <div className="absolute left-6 right-16 top-6 text-white">
          <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-white/15 backdrop-blur">
            {post.category}
          </span>
                </div>
                <div className="absolute left-6 right-16 bottom-6 text-white">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="mt-2 text-sm/5 text-white/80 line-clamp-2">{post.excerpt}</p>
                </div>

                <span
                    className="pointer-events-none absolute right-6 bottom-6 grid h-9 w-9 place-items-center rounded-xl bg-[#D08B4C] text-white shadow-sm transition transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
  <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
  >
    <path
        d="M7 17L17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
  </svg>
</span>

            </Link>
        )
    }

    // light
    return (
        <Link
            href={href}
            className={clsx(
                'relative block rounded-md bg-[#F5F5F5] h-full min-h-[260px] p-6',
                'hover:shadow-xl transition-shadow',
                className
            )}
        >
      <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-black/5">
        {post.category}
      </span>
            <h3 className="mt-4 text-xl font-semibold text-neutral-800">{post.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>

            <span
                className="pointer-events-none absolute right-6 bottom-6 grid h-9 w-9 place-items-center rounded-xl bg-[#D08B4C] text-white shadow-sm transition transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
  <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
  >
    <path
        d="M7 17L17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
  </svg>
</span>

        </Link>
    )
}

'use client'

import Link from 'next/link'
import { Fragment } from 'react'

type Crumb = { label: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
            <ol className="flex flex-wrap items-center">
                {items.map((it, i) => {
                    const isLast = i === items.length - 1
                    return (
                        <Fragment key={i}>
                            {i > 0 && <li className="mx-2 text-neutral-400">/</li>}
                            <li>
                                {isLast || !it.href ? (
                                    <span className="text-neutral-900">{it.label}</span>
                                ) : (
                                    <Link
                                        href={it.href}
                                        className="hover:text-neutral-800 underline-offset-4 hover:underline"
                                    >
                                        {it.label}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    )
                })}
            </ol>
        </nav>
    )
}

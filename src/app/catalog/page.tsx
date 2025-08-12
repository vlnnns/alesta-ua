import Link from 'next/link'
import { Prisma } from '@prisma/client'
import type { PlywoodProduct } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import CatalogProductGrid from '@/components/catalog/CatalogProductGrid'

export const metadata = {
    title: 'Каталог',
    description: 'Виберіть тип фанери та перегляньте доступні варіанти',
}

export const revalidate = 0
export const dynamic = 'force-dynamic'

type PlywoodType =
    | 'ФСФ' | 'ФК' | 'ФКМ' | 'Ламінована' | 'Для Лазера' | 'Транспортна' | 'Для Опалубки'
type FilterType = PlywoodType | 'all'

const TYPES: PlywoodType[] = ['ФСФ','ФК','ФКМ','Ламінована','Для Лазера','Транспортна','Для Опалубки']

function getTypeParam(raw: unknown): FilterType {
    if (typeof raw !== 'string') return 'all'
    const v = decodeURIComponent(raw)
    return (TYPES as readonly string[]).includes(v) ? (v as PlywoodType) : 'all'
}

export default async function CatalogPage({ searchParams }: { searchParams: { type?: string } }) {
    const typeParam = getTypeParam(searchParams?.type)

    const where: Prisma.PlywoodProductWhereInput =
        typeParam === 'all' ? {} : { type: typeParam }

    const items: PlywoodProduct[] = await prisma.plywoodProduct.findMany({
        where,
        orderBy: { id: 'asc' },
        take: 200,
    })

    return (
        <main className="bg-white text-neutral-800">
            <div className="w-full px-4 sm:px-6 py-10">
                {/* breadcrumbs */}
                <nav className="text-sm text-neutral-500 mb-6">
                    <Link href="/" className="hover:text-neutral-700">Головна</Link>
                    <span className="mx-2">/</span>
                    <span className="text-neutral-700">Каталог</span>
                </nav>

                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 text-neutral-900">
                    Каталог
                </h1>

                {/* 2 columns: sidebar + content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT — types */}
                    <aside className="w-full lg:w-[260px] lg:shrink-0 lg:sticky lg:top-24 self-start">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-900">Типи фанери</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/catalog"
                                    scroll={false}
                                    className={`block rounded-xl px-4 py-2 border transition
                    ${typeParam === 'all'
                                        ? 'border-[#D08B4C] bg-[#FFF9F3] text-neutral-900'
                                        : 'border-neutral-200 hover:border-neutral-300'}`}
                                >
                                    Усі
                                </Link>
                            </li>
                            {TYPES.map((t) => {
                                const href = `/catalog?type=${encodeURIComponent(t)}`
                                const active = typeParam === t
                                return (
                                    <li key={t}>
                                        <Link
                                            href={href}
                                            scroll={false}
                                            className={`block rounded-xl px-4 py-2 border transition
                        ${active
                                                ? 'border-[#D08B4C] bg-[#FFF9F3] text-neutral-900'
                                                : 'border-neutral-200 hover:border-neutral-300'}`}
                                        >
                                            {t}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </aside>

                    {/* RIGHT — products with “+” and таким же поведением */}
                    <section className="flex-1 min-w-0">
                        <div className="mb-4">
              <span className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-black/5 text-neutral-700">
                Тип:{' '}
                  <strong className="font-medium text-neutral-900">
                  {typeParam === 'all' ? 'Усі' : typeParam}
                </strong>
              </span>
                        </div>

                        {items.length ? (
                            <CatalogProductGrid items={items} />
                        ) : (
                            <div className="text-center text-neutral-600 py-12">
                                Нічого не знайдено для обраного типу.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    )
}

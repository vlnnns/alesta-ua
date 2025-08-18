import Link from 'next/link'
import { Prisma } from '@prisma/client'
import type { PlywoodProduct } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import CatalogProductGrid from '@/components/catalog/CatalogProductGrid'
import TypeFilterPicker from '@/components/catalog/TypeFilterPicker'


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
    try {
        const v = decodeURIComponent(raw)
        return (TYPES as readonly string[]).includes(v) ? (v as PlywoodType) : 'all'
    } catch {
        return 'all'
    }
}

type CatalogSearchParams = { type?: string }


export default async function CatalogPage({
                                              searchParams,
                                          }: {
    searchParams: Promise<CatalogSearchParams>
}) {
    const sp = await searchParams
    const typeParam = getTypeParam(sp?.type)

    const where: Prisma.PlywoodProductWhereInput =
        typeParam === 'all' ? {} : { type: typeParam }

    const items: PlywoodProduct[] = await prisma.plywoodProduct.findMany({
        where,
        orderBy: { id: 'asc' },
        take: 200,
    })

    return (
        <main className="bg-[#F5F5F5] text-neutral-800">
            <div className="w-full px-4 sm:px-6 py-10 max-w-7xl mx-auto">
                {/* breadcrumbs */}
                <nav className="text-sm text-neutral-500 mb-6">
                    <Link href="/" className="hover:text-neutral-700">Головна</Link>
                    <span className="mx-2">/</span>
                    <span className="text-neutral-700">Каталог</span>
                </nav>

                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 text-neutral-900">
                    Каталог
                </h1>


                <div className="flex flex-col sm:flex-row gap-8">
                    {/* LEFT — types (тільки на sm+) */}
                    <aside
                        className={[
                            'hidden sm:block',                  // ← приховано на мобі
                            'sm:sticky sm:top-24 sm:w-[260px] sm:shrink-0 self-start',
                        ].join(' ')}
                    >
                        <h2 className="text-lg font-semibold mb-4 text-neutral-900">
                            Типи фанери
                        </h2>

                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/catalog"
                                    scroll={false}
                                    className={[
                                        'block w-full rounded-xl px-4 py-2 border transition',
                                        typeParam === 'all'
                                            ? 'border-[#D08B4C] bg-white text-neutral-900'
                                            : 'border-neutral-200 hover:border-neutral-300',
                                    ].join(' ')}
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
                                            className={[
                                                'block w-full rounded-xl px-4 py-2 border transition',
                                                active
                                                    ? 'border-[#D08B4C] bg-white text-neutral-900'
                                                    : 'border-neutral-200 hover:border-neutral-300',
                                            ].join(' ')}
                                        >
                                            {t}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </aside>

                    {/* RIGHT — products */}
                    <section className="flex-1 min-w-0">
                        <div className="mb-4">
                            <TypeFilterPicker types={TYPES} activeType={typeParam} />
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
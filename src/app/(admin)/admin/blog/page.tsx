// app/admin/blog/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

function fmtDate(d: Date | null) {
    return d ? new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium' }).format(d) : '—'
}

export default async function AdminBlogListPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }],
    })

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-5xl">
                <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Адмінка', href: '/admin' }, { label: 'Блог' }]} />

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Пости блогу</h1>
                    <Link href="/admin/blog/new" className="rounded-xl bg-[#D08B4C] px-4 py-2 text-white hover:bg-[#c57b37]">
                        + Новий пост
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50 text-neutral-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Заголовок</th>
                            <th className="px-4 py-3 text-left">Категорія</th>
                            <th className="px-4 py-3 text-left">Публ.</th>
                            <th className="px-4 py-3 text-left">Фіч.</th>
                            <th className="px-4 py-3 text-left">Оновлено</th>
                            <th className="px-4 py-3 text-right">Дії</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                        {posts.map((p) => (
                            <tr key={p.id}>
                                <td className="px-4 py-3">{p.title}</td>
                                <td className="px-4 py-3">{p.category || '—'}</td>
                                <td className="px-4 py-3">{p.published ? 'так' : 'ні'}</td>
                                <td className="px-4 py-3">{p.featured ? 'так' : 'ні'}</td>
                                <td className="px-4 py-3">{fmtDate(p.updatedAt)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/blog/${p.id}/edit`} className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50">
                                            Редагувати
                                        </Link>

                                        {/* Форма удаления — обычный POST на роут */}
                                        <form action="/admin/blog/delete" method="POST">
                                            <input type="hidden" name="id" value={p.id} />
                                            {/* Кнопка-подтверждение — клиентский компонент */}
                                            <ConfirmDeleteButton />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!posts.length && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">Поки що немає постів</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

// Импортируйте клиентскую кнопку из компонента ниже
import ConfirmDeleteButton from '@/components/blog/ConfirmDeleteButton'
import Breadcrumbs from "@/components/common/Breadcrumbs";

// app/(admin)/admin/blog/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { plainToHtml } from '@/lib/plainText'
import AdminPostForm from '@/components/blog/AdminPostForm'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return notFound()

    // ВЫНОСИМ то, что нужно из post, чтобы не ссылаться на него в action
    const initialPublishedAt = post.publishedAt ?? null

    async function action(formData: FormData) {
        'use server'
        const title = String(formData.get('title') ?? '').trim()
        const slugInput = String(formData.get('slug') ?? '')
        const slug = slugify(slugInput || title)
        const excerpt = String(formData.get('excerpt') ?? '')
        const category = String(formData.get('category') ?? '').trim() || null
        const coverImage = String(formData.get('coverImage') ?? '').trim() || null
        const bodyText = String(formData.get('bodyText') ?? '')
        const bodyHtml = plainToHtml(bodyText)
        const featured = !!formData.get('featured')
        const published = !!formData.get('published')

        await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                category,
                coverImage,
                excerpt,
                bodyHtml,
                featured,
                published,
                // используем initialPublishedAt, а не post.publishedAt
                publishedAt: published ? (initialPublishedAt ?? new Date()) : null,
            },
        })

        revalidatePath('/admin/blog')
        revalidatePath('/blog')
        redirect('/admin/blog')
    }

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl">
                <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Адмінка', href: '/admin' }, { label: 'Блог', href: '/admin/blog' }, { label: 'Редагувати пост'}]} />
                <h1 className="text-2xl font-semibold mb-6">Редагувати пост</h1>

                <AdminPostForm
                    action={action}
                    submitLabel="Зберегти"
                    initial={{
                        title: post.title,
                        slug: post.slug,
                        category: post.category || '',
                        coverImage: post.coverImage || '',
                        excerpt: post.excerpt,
                        bodyHtml: post.bodyHtml,
                        featured: post.featured,
                        published: post.published,
                    }}
                />
            </div>
        </main>
    )
}

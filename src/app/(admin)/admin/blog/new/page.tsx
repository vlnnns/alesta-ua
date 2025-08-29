// app/(admin)/admin/blog/new/page.tsx
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { plainToHtml } from '@/lib/plainText'
import AdminPostForm from '@/components/blog/AdminPostForm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function NewPostPage() {
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

        await prisma.blogPost.create({
            data: {
                title, slug, category, coverImage, excerpt, bodyHtml,
                featured, published,
                publishedAt: published ? new Date() : null,
            },
        })
        revalidatePath('/admin/blog'); revalidatePath('/blog')
        redirect('/admin/blog')
    }

    return (
        <main className="px-4 sm:px-6 py-10 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl">
                <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Адмінка', href: '/admin/blog' }, { label: 'Блог', href: '/blog' }, { label: 'Новий пост'}]} />

                <h1 className="text-2xl font-semibold mb-6">Новий пост</h1>
                <AdminPostForm action={action} submitLabel="Створити" />
            </div>
        </main>
    )
}

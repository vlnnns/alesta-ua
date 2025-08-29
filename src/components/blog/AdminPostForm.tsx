// components/blog/AdminPostForm.tsx
'use client'

import { htmlToPlain } from '@/lib/plainText'

export type PostFormValues = {
    title: string
    slug?: string
    category?: string
    coverImage?: string
    excerpt: string
    bodyText: string
    featured?: boolean
    published?: boolean
}

export default function AdminPostForm({
                                          action,                     // ← имя пропса сменили
                                          submitLabel = 'Зберегти',
                                          initial,
                                      }: {
    action: (formData: FormData) => void | Promise<void>   // ← тип под Server Action
    submitLabel?: string
    initial?: {
        title?: string; slug?: string; category?: string; coverImage?: string;
        excerpt?: string; bodyHtml?: string; featured?: boolean; published?: boolean;
    }
}) {
    const defaultBody = initial?.bodyHtml ? htmlToPlain(initial.bodyHtml) : ''

    return (
        <form action={action} className="space-y-4">
            <label className="block">
                <span className="block text-sm text-neutral-600">Заголовок</span>
                <input name="title" defaultValue={initial?.title ?? ''} className="mt-1 w-full rounded-md border px-3 py-2" />
            </label>

            <label className="block">
                <span className="block text-sm text-neutral-600">Slug</span>
                <input name="slug" defaultValue={initial?.slug ?? ''} className="mt-1 w-full rounded-md border px-3 py-2" />
            </label>

            <label className="block">
                <span className="block text-sm text-neutral-600">Категорія</span>
                <input name="category" defaultValue={initial?.category ?? ''} className="mt-1 w-full rounded-md border px-3 py-2" />
            </label>

            <label className="block">
                <span className="block text-sm text-neutral-600">Обкладинка (URL)</span>
                <input name="coverImage" defaultValue={initial?.coverImage ?? ''} className="mt-1 w-full rounded-md border px-3 py-2" />
            </label>

            <label className="block">
                <span className="block text-sm text-neutral-600">Короткий опис</span>
                <textarea name="excerpt" defaultValue={initial?.excerpt ?? ''} rows={3} className="mt-1 w-full rounded-md border px-3 py-2" />
            </label>

            <label className="block">
                <span className="block text-sm text-neutral-600">Текст (звичайний, без тегів)</span>
                <textarea
                    name="bodyText"
                    defaultValue={defaultBody}
                    rows={16}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder={`Пишіть текст. Порожній рядок = новий абзац. Один перенос — новий рядок.`}
                />
            </label>

            <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="featured" defaultChecked={!!initial?.featured} />
                    <span>Featured</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="published" defaultChecked={!!initial?.published} />
                    <span>Опубліковано</span>
                </label>
            </div>

            <button className="rounded-xl bg-[#D08B4C] px-4 py-2 text-white hover:bg-[#c57b37]">
                {submitLabel}
            </button>
        </form>
    )
}

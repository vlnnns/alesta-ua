import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client' // ⬅️ для типу помилки

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    const back = new URL('/admin/blog', req.url)

    try {
        const data = await req.formData()
        const id = Number(data.get('id'))

        // некоректний або відсутній id → просто повертаємось назад
        if (!Number.isFinite(id) || id <= 0) {
            return NextResponse.redirect(back)
        }

        // видаляємо; якщо пост уже видалений — ігноруємо (Prisma P2025)
        try {
            await prisma.blogPost.delete({ where: { id } })
        } catch (err: unknown) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
                // записи вже немає — ок
            } else {
                throw err
            }
        }

        // Перебудова кеша
        revalidatePath('/admin/blog')
        revalidatePath('/blog')

        return NextResponse.redirect(back)
    } catch {
        const url = new URL('/admin/blog', req.url)
        url.searchParams.set('err', 'delete_failed')
        return NextResponse.redirect(url)
    }
}

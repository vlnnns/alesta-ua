// app/admin/blog/delete/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
    const data = await req.formData()
    const id = Number(data.get('id'))
    const url = new URL('/admin/blog', req.url)

    if (!id) return NextResponse.redirect(url)

    await prisma.blogPost.delete({ where: { id } })

    // Перестройка кэша
    revalidatePath('/admin/blog')
    revalidatePath('/blog')

    return NextResponse.redirect(url)
}

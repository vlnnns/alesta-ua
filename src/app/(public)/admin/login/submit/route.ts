import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    const form = await req.formData()

    const username = String(form.get('username') ?? '')
    const password = String(form.get('password') ?? '')
    const nextRaw = form.get('next')

    // Санітизуємо next, щоб не було Invalid URL і відкритих редіректів
    const next =
        typeof nextRaw === 'string' && nextRaw.startsWith('/') && !nextRaw.startsWith('/admin/login')
            ? nextRaw
            : '/admin'

    const okUser = process.env.ADMIN_USER || 'admin'
    const okPass = process.env.ADMIN_PASS || 'password'
    if (username !== okUser || password !== okPass) {
        const url = new URL('/admin/login', req.url)
        url.searchParams.set('err', 'creds')
        url.searchParams.set('next', next)
        return NextResponse.redirect(url)
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8 // 8 год
    const token = await signToken('admin', exp, process.env.AUTH_SECRET || 'dev-secret')

    const res = NextResponse.redirect(new URL(next, req.url))
    res.headers.append(
        'Set-Cookie',
        `admin_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 8}; ${
            process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
        }`
    )
    return res
}

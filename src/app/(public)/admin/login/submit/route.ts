import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    const form = await req.formData()

    const username = String(form.get('username') ?? '')
    const password = String(form.get('password') ?? '')
    const nextRaw = form.get('next')

    // allow only internal paths (no //, no /admin/login)
    let nextPath = '/admin'
    if (
        typeof nextRaw === 'string' &&
        nextRaw.startsWith('/') &&
        !nextRaw.startsWith('//') &&
        !nextRaw.startsWith('/admin/login')
    ) {
        try {
            const u = new URL(nextRaw, 'http://dummy')
            nextPath = u.pathname + u.search + u.hash
        } catch {}
    }

    const okUser = process.env.ADMIN_USER ?? 'admin'
    const okPass = process.env.ADMIN_PASS ?? 'password'
    if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_USER || !process.env.ADMIN_PASS)) {
        return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
    }

    // small delay against brute force (optional)
    await new Promise(r => setTimeout(r, 150))

    // build origin from request headers (works behind nginx too)
    const hdrs = new Headers(req.headers)
    const host = hdrs.get('host') ?? new URL(req.url).host
    const proto = (hdrs.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':',''))
    const origin = `${proto}://${host}`

    if (username !== okUser || password !== okPass) {
        const url = new URL('/admin/login', origin)
        url.searchParams.set('err', 'creds')
        url.searchParams.set('next', nextPath)
        return NextResponse.redirect(url, { status: 303 })
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8
    const token = await signToken('admin', exp, process.env.AUTH_SECRET || 'dev-secret')

    const res = NextResponse.redirect(new URL(nextPath, origin), { status: 303 })
    res.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: proto === 'https',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 8,
    })
    return res
}

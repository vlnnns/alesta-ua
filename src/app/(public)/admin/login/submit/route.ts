import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    const form = await req.formData()

    const username = String(form.get('username') ?? '')
    const password = String(form.get('password') ?? '')
    const nextRaw = form.get('next')

    // Resolve & validate "next" to avoid invalid URL and open redirects
    let nextPath = '/admin'
    if (typeof nextRaw === 'string') {
        try {
            const current = new URL(req.url)
            const resolved = new URL(nextRaw, current) // handles relative/absolute safely
            const sameOrigin = resolved.origin === current.origin
            const notLogin = !resolved.pathname.startsWith('/admin/login')
            const notSchemeRelative = !nextRaw.startsWith('//')
            if (sameOrigin && notLogin && notSchemeRelative) {
                nextPath = resolved.pathname + resolved.search + resolved.hash
            }
        } catch {
            /* keep default /admin */
        }
    }

    const okUser = process.env.ADMIN_USER
    const okPass = process.env.ADMIN_PASS
    if (process.env.NODE_ENV === 'production' && (!okUser || !okPass)) {
        return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
    }

    // tiny delay to reduce brute-force (optional)
    await new Promise(r => setTimeout(r, 150))

    if (username !== (okUser ?? 'admin') || password !== (okPass ?? 'password')) {
        const url = new URL('/admin/login', req.url)
        url.searchParams.set('err', 'creds')
        url.searchParams.set('next', nextPath)
        return NextResponse.redirect(url, { status: 303 })
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8 // 8 hours
    const token = await signToken('admin', exp, process.env.AUTH_SECRET || 'dev-secret')

    const res = NextResponse.redirect(new URL(nextPath, req.url), { status: 303 })
    res.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',      // stricter for admin areas
        path: '/',
        maxAge: 60 * 60 * 8,
    })
    return res
}

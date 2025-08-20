import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    const form = await req.formData()

    const username = String(form.get('username') ?? '')
    const password = String(form.get('password') ?? '')
    const nextRaw = form.get('next')

    // дозволяємо переходити лише на внутрішні посилання
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

    // маленька пауза проти brute-force
    await new Promise(r => setTimeout(r, 150))

    if (username !== okUser || password !== okPass) {
        // ВАЖЛИВО: відносний redirect, щоб не летіти на localhost за проксі
        const res = new NextResponse(null, {
            status: 303,
            headers: { Location: `/admin/login?err=creds&next=${encodeURIComponent(nextPath)}` },
        })
        // no-cache
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        return res
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8
    const token = await signToken('admin', exp, process.env.AUTH_SECRET || 'dev-secret')

    const res = new NextResponse(null, {
        status: 303,
        headers: { Location: nextPath }, // відносний redirect
    })

    res.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',               // 'lax' надійніше для redirect‑сценаріїв
        path: '/',
        maxAge: 60 * 60 * 8,
    })

    // no-cache
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    return res
}

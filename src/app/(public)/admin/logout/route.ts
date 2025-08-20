// src/app/(public)/admin/logout/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'   // щоб не закешувався

export async function GET(req: Request) {
    const res = NextResponse.redirect(new URL('/admin/login?msg=loggedout', req.url), { status: 302 })

    // видалити cookie (безпечно і крос‑браузерно)
    res.cookies.set('admin_session', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,                 // миттєво
        expires: new Date(0),      // на випадок старих браузерів
    })

    return res
}

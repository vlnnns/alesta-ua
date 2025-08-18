// src/app/(public)/admin/logout/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('msg', 'loggedout') // опціонально

    const res = NextResponse.redirect(url)
    res.headers.set(
        'Set-Cookie',
        `admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV==='production' ? 'Secure; ' : ''}`
    )
    return res
}

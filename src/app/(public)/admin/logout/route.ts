// src/app/(public)/admin/logout/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    // 1) відносний redirect -> ніколи не потрапить на localhost
    const res = new NextResponse(null, {
        status: 302,
        headers: { Location: '/admin/login?msg=loggedout' },
    })

    // 2) коректно прибираємо сесійну куку
    res.cookies.set('admin_session', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        expires: new Date(0),
    })

    return res
}

import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
    const res = new NextResponse(null, { status: 302, headers: { Location: '/admin/login?msg=loggedout' } })
    res.cookies.set('admin_session', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        expires: new Date(0),
    })
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    return res
}

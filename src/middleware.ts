// src/middleware.ts
import { NextResponse, NextRequest } from 'next/server'

export const config = {
    matcher: ['/admin/:path*'], // захищаємо всі адмін-роути
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl

    // пропускаємо сторінки логіна/логаута
    if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')) {
        return NextResponse.next()
    }

    const session = req.cookies.get('admin_session')?.value

    if (!session) {
        // немає сесії -> редірект на логін
        const url = new URL('/admin/login', req.url)
        // збережемо, куди повертати після логіна
        url.searchParams.set('next', pathname + (search || ''))
        const res = NextResponse.redirect(url)
        // на всяк випадок вимикаємо кеш
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        return res
    }

    // для адмін‑сторінок забороняємо кеш браузера
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    return res
}

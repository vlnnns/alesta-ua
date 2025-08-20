import { NextResponse, NextRequest } from 'next/server'

export const config = {
    matcher: ['/admin/:path*'],
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl

    // пропускаємо сторінки логіна/логаута та сам submit
    if (
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/admin/logout')
    ) {
        return NextResponse.next()
    }

    const session = req.cookies.get('admin_session')?.value

    if (!session) {
        const url = new URL('/admin/login', req.url)
        url.searchParams.set('next', pathname + (search || ''))
        const res = NextResponse.redirect(url)
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        return res
    }

    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    return res
}

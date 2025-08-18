// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // ← явний шлях у src

export async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    const isLogin  = pathname === '/admin/login'  || pathname.startsWith('/admin/login/')
    const isLogout = pathname === '/admin/logout' || pathname.startsWith('/admin/logout/')
    const isPublic =
        isLogin || isLogout ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname.startsWith('/uploads/')

    if (isPublic) return NextResponse.next()

    if (pathname.startsWith('/admin')) {
        const token = req.cookies.get('admin_session')?.value;
        const secret = process.env.AUTH_SECRET || 'dev-secret';
        if (await verifyToken(token, secret)) return NextResponse.next();

        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('next', pathname + (search || ''));
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };

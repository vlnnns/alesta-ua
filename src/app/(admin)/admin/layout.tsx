import { ReactNode } from 'react'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Next 15: cookies()/headers() – асинхронні
    const cookieStore = await cookies()
    const hdrs = await headers()

    // Заборона кешу на рівні відповіді (допомагає проти CDN)
    // (У layout не можна ставити кастомні заголовки напряму,
    // але dynamic/fetchCache/no-store вже підказують Next робити no-cache.)
    // За бажанням продублюй це ще в middleware (у тебе вже стоїть).

    const session = cookieStore.get('admin_session')?.value
    if (!session) {
        // Повернемо користувача на логін і збережемо next
        const path = hdrs.get('x-pathname') ?? '' // не завжди є, тож fallback нижче
        const url = hdrs.get('x-url') // не стандартизовано; не всюди є
        // Найнадійніше — просто просити логін заново без «next», або додати його на клієнті
        redirect('/admin/login')
    }

    return <>{children}</>
}

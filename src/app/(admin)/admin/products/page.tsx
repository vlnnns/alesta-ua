// src/app/admin/products/page.tsx  (server)
import { Suspense } from 'react'
import AdminProductsClient from '@/components/admin/AdminProductsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
    return (
        <Suspense fallback={<div className="px-4 sm:px-6 py-10">Завантаження…</div>}>
            <AdminProductsClient />
        </Suspense>
    )
}

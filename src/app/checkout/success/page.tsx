import Link from 'next/link'

export default function SuccessPage({ searchParams }: { searchParams: { id?: string } }) {
    const id = searchParams?.id
    return (
        <main className="px-4 sm:px-6 py-16 mt-12 bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                <h1 className="text-3xl font-semibold">Дякуємо за замовлення!</h1>
                <p className="mt-2 text-neutral-600">
                    Ваше замовлення {id ? <strong>№{id}</strong> : null} прийнято. Менеджер зв’яжеться з вами найближчим часом.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/catalog" className="rounded-xl border border-neutral-200 px-4 py-2 hover:bg-neutral-50">
                        Продовжити покупки
                    </Link>
                    <Link href="/" className="rounded-xl bg-[#D08B4C] px-4 py-2 text-white hover:bg-[#c57b37]">
                        На головну
                    </Link>
                </div>
            </div>
        </main>
    )
}

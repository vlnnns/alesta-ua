export const revalidate = 0;

export default async function AdminLoginPage({
                                                 searchParams,
                                             }: {
    searchParams: Promise<{ next?: string; err?: string }>
}) {
    const sp = await searchParams; // ⬅️ ВАЖЛИВО: await у Next 15
    const next =
        typeof sp?.next === 'string' && sp.next.startsWith('/') ? sp.next : '/admin';
    const err = sp?.err === 'creds';

    return (
        <main className="min-h-screen grid place-items-center bg-neutral-50 px-4 text-neutral-700">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">Вхід в адмінку</h1>
                <p className="mt-1 text-sm text-neutral-600">Укажіть облікові дані.</p>

                {err && (
                    <div className="mt-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
                        Невірний логін або пароль
                    </div>
                )}

                <form method="POST" action="/admin/login/submit" className="mt-5 space-y-4">
                    <input type="hidden" name="next" value={next} />
                    <label className="block text-sm">
                        <span className="mb-1 block">Логін</span>
                        <input
                            name="username"
                            className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30"
                            required
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block">Пароль</span>
                        <input
                            type="password"
                            name="password"
                            className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#D08B4C]/30"
                            required
                        />
                    </label>

                    <button type="submit" className="w-full rounded-xl bg-[#D08B4C] px-4 py-2.5 text-white hover:bg-[#c57b37]">
                        Увійти
                    </button>
                </form>
            </div>
        </main>
    );
}

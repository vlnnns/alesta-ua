// app/about/page.tsx
import Link from 'next/link'
import TrustedPartnerSection from '@/components/TrustedPartnerSection'
import { Factory, Trees, Package, ShieldCheck, Globe, Handshake } from 'lucide-react'

export const metadata = {
    title: 'Про нас',
    description:
        'ALESTA UA — надійний партнер у світі матеріалів. Будівельна, меблева та інші галузі.',
}

const glass =
    'rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.25)]'

export default function AboutPage() {
    return (
        <main className="relative bg-neutral-950 text-white overflow-hidden">
            {/* blurred gradients for depth */}
            <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#D08B4C]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-0">
                <nav className="text-sm text-white/60 mb-6">
                    <Link href="/" className="hover:text-white cursor-pointer">Головна</Link>
                    <span className="mx-2">/</span>
                    <span className="text-white">Про нас</span>
                </nav>
            </div>

            {/* HERO (dark variant) */}
            <TrustedPartnerSection
                id="about"
                className="bg-transparent"
                bgSrc="/about.png"
                bgAlt="Команда ALESTA UA та матеріали"
                variant="dark"
            />

            {/* Block 2 — Що ми постачаємо (без бегущего градиента) */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* мягкие размазанные пятна для глубины */}
                <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#D08B4C]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                <div className="max-w-7xl mx-auto">
                    <div className={`relative overflow-hidden`}>
                        {/* лёгкие световые пятна */}
                        <div className="pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_65%)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.06),transparent_35%)]" />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Left: текст */}
                            <div className="lg:w-5/12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
            Що ми робимо
          </span>
                                <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Що ми постачаємо</h2>
                                <p className="mt-3 text-white/80">
                                    Основні напрями — шпон (бук, береза, вільха, смерека, сосна, червоний дуб), фанера та
                                    рішення з дерев’яної тари/пакування для промисловості.
                                </p>

                                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <li className="flex items-center gap-2 text-white/85">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D08B4C]" /> Плитні матеріали та фанера
                                    </li>
                                    <li className="flex items-center gap-2 text-white/85">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D08B4C]" /> Шпон та пиломатеріали
                                    </li>
                                    <li className="flex items-center gap-2 text-white/85">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D08B4C]" /> Дерев’яна тара/пакування
                                    </li>
                                    <li className="flex items-center gap-2 text-white/85">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D08B4C]" /> Експорт і логістика
                                    </li>
                                </ul>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href="/catalog"
                                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-[#D08B4C]/70 text-[#FFDDB8] hover:bg-[#D08B4C]/20 transition-colors"
                                    >
                                        Переглянути каталог →
                                    </Link>
                                    <Link
                                        href="/contacts"
                                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-white/15 text-white/90 hover:bg-white/10 transition-colors"
                                    >
                                        Запит на комерційну пропозицію
                                    </Link>
                                </div>
                            </div>

                            {/* Right: сет тегов (без эффекта «свайпа») */}
                            <div className="lg:flex-1">
                                <div className="relative">
                                    <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
                                        {['Beech','Birch','Alder','Spruce','Pine','Red Oak'].map((name) => (
                                            <div
                                                key={name}
                                                className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5
                             px-4 py-3 text-center text-sm text-white/90 backdrop-blur-sm
                             transition hover:shadow-[0_10px_30px_rgba(208,139,76,0.12)]
                             hover:border-[#D08B4C]/40 hover:bg-white/10"
                                            >
                                                {/* лёгкое тёплое свечение без движения */}
                                                <span className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full bg-[#D08B4C]/10 blur-xl" />
                                                <span className="relative">{name} Veneer</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* Block 3 — Якість, сертифікації та географія */}
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-12">
                    <div className={`md:col-span-7 p-6 sm:p-8 ${glass}`}>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Якість та відповідність</h2>
                        <p className="mt-4 text-white/80">
                            Дотримуємось міжнародних стандартів якості й безпеки. Пакувальні рішення підтримують
                            вимоги глобальної логістики (ISPM-15).
                        </p>
                        {/*<div className="mt-6 flex flex-wrap gap-3">*/}
                        {/*    <Link*/}
                        {/*        href="/certifications"*/}
                        {/*        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-white/15 text-white/90 hover:bg-white/10"*/}
                        {/*    >*/}
                        {/*        Сертифікації*/}
                        {/*    </Link>*/}
                        {/*    <Link*/}
                        {/*        href="/contacts"*/}
                        {/*        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-[#D08B4C]/70 text-[#FFDDB8] hover:bg-[#D08B4C]/20"*/}
                        {/*    >*/}
                        {/*        Зв’язатися з відділом якості*/}
                        {/*    </Link>*/}
                        {/*</div>*/}
                    </div>

                    <div className="md:col-span-5 space-y-4">
                        <div className={`p-5 ${glass}`}>
                            <h3 className="font-semibold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-[#D08B4C]" />
                                Географія постачань
                            </h3>
                            <p className="mt-2 text-sm text-white/75">
                                Операції в Україні та зростання присутності у Східній Європі. Стабільні поставки
                                завдяки локальним потужностям і досвіду експорту.
                            </p>
                        </div>
                        <div className={`p-5 ${glass}`}>
                            <h3 className="font-semibold flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-[#D08B4C]" />
                                Надійність постачання
                            </h3>
                            <p className="mt-2 text-sm text-white/75">
                                Прозорі специфікації, контроль якості сировини та готової продукції, гнучка логістика
                                для промислових клієнтів.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

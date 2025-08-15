// components/TrustedPartnerSection.tsx
'use client'

import Image from 'next/image'
import clsx from 'clsx'

type Props = { id?: string; className?: string }

export default function TrustedPartnerSection({
                                                  id = 'partners',
                                                  className = '',
                                              }: Props) {
    return (
        <section
            id={id}
            className={clsx(
                'relative py-14 sm:py-20',
                // базовые горизонтальные отступы контейнера
                'px-4 sm:px-6 lg:px-8',
                className
            )}
            aria-labelledby="trusted-title"
        >
            {/* Background image + overlay для контраста */}
            <Image
                src="/about.png" // лежит в public/plywood
                alt="" // декоративный фон
                fill
                priority
                className="-z-10 object-cover"
            />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-white/55 sm:bg-white/45" />

            <div className="mx-auto max-w-7xl">
                {/* 2‑колоночный layout на md+, один столбец на мобилках */}
                <div className="grid items-stretch gap-8 sm:gap-10 md:grid-cols-12">
                    {/* Left */}
                    <div className="md:col-span-5 flex items-center">
                        <h2
                            id="trusted-title"
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-neutral-900"
                        >
                            <span className="text-[#D08B4C]">НАДІЙНИЙ</span> ПАРТНЕР
                            <br className="hidden sm:block" /> У СВІТІ МАТЕРІАЛІВ
                        </h2>
                    </div>

                    {/* Right */}
                    <div className="md:col-span-7">
                        <div className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-md p-5 sm:p-7 lg:p-10">
                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                {[
                                    { n: '25+', t: 'років стабільної роботи на ринку' },
                                    { n: '100%', t: 'натуральна деревина без токсинів' },
                                    { n: '12', t: 'типів матеріалів в асортименті' },
                                    { n: '98%', t: 'клієнтів звертаються повторно' },
                                ].map((s) => (
                                    <div
                                        key={s.n + s.t}
                                        className="rounded-xl bg-[#D08B4C]/90 text-white px-3 py-5 sm:px-4 sm:py-6 flex flex-col items-center text-center min-h-[110px]"
                                    >
                                        <div className="text-2xl sm:text-3xl font-bold leading-none">
                                            {s.n}
                                        </div>
                                        <p className="mt-2 text-xs sm:text-sm leading-snug opacity-95">
                                            {s.t}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed mb-5 sm:mb-6">
                                <strong>ALESTA UA</strong> — Постачальник високоякісної продукції
                                для будівельної, меблевої, машинобудівної та інших галузей.
                                Низька вартість не гарантує якості, тому ми сформували асортимент,
                                що задовольнить потреби та бюджет будь‑якого Замовника.
                            </p>

                            {/* Button */}
                            <a
                                href="/catalog"
                                className="inline-flex items-center gap-2 text-[#D08B4C] text-base font-medium hover:underline"
                            >
                                Переглянути всю продукцію →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

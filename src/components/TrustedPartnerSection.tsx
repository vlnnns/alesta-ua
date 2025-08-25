// components/TrustedPartnerSection.tsx
'use client'

import Image from 'next/image'
import clsx from 'clsx'

type Props = {
    id?: string
    className?: string
    bgSrc?: string
    bgAlt?: string
    overlayClassName?: string
    /** Light by default; dark switches colors + glass panels */
    variant?: 'light' | 'dark'
}

export default function TrustedPartnerSection({
                                                  id = 'partners',
                                                  className = '',
                                                  bgSrc = '/about.png',
                                                  bgAlt = '',
                                                  overlayClassName,
                                                  variant = 'light',
                                              }: Props) {
    const isDark = variant === 'dark'
    const overlay =
        overlayClassName ??
        (isDark ? 'bg-black/55 sm:bg-black/50' : 'bg-white/55 sm:bg-white/45')

    return (
        <section
            id={id}
            className={clsx('relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8', className)}
            aria-labelledby="trusted-title"
        >
            {bgSrc && (
                <Image src={bgSrc} alt={bgAlt} fill priority className="-z-10 object-cover" />
            )}
            <div className={clsx('pointer-events-none absolute inset-0 -z-10', overlay)} />

            <div className="mx-auto max-w-7xl">
                <div className="grid items-stretch gap-8 sm:gap-10 md:grid-cols-12">
                    {/* Left */}
                    <div className="md:col-span-5 flex items-start">
                        <h2
                            id="trusted-title"
                            className={clsx(
                                'text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]',
                                isDark ? 'text-white' : 'text-neutral-900'
                            )}
                        >
                            <span className="text-[#D08B4C]">НАДІЙНИЙ</span> ПАРТНЕР
                            <br className="hidden sm:block" /> У СВІТІ МАТЕРІАЛІВ
                        </h2>
                    </div>

                    {/* Right */}
                    <div className="md:col-span-7">
                        <div
                            className={clsx(
                                'rounded-2xl shadow-md p-5 border',
                                isDark
                                    ? 'bg-white/10 backdrop-blur-md border-white/15 text-white'
                                    : 'bg-white/90 backdrop-blur-sm border-black/5 text-neutral-900'
                            )}
                        >
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
                                        className={clsx(
                                            // ✅ додано justify-center
                                            'rounded-xl px-2 py-2 min-h-[110px] flex flex-col items-center justify-center text-center',
                                            isDark ? 'bg-[#D08B4C]/80 text-white' : 'bg-[#D08B4C]/90 text-white'
                                        )}
                                    >
                                        <div className="text-2xl sm:text-3xl font-bold leading-none text-center">{s.n}</div>
                                        <p className="mt-2 text-xs leading-snug opacity-95 text-center">{s.t}</p>
                                    </div>
                                ))}
                            </div>


                            {/* Description */}
                            <p
                                className={clsx(
                                    'text-sm sm:text-base leading-relaxed mb-5 sm:mb-6',
                                    isDark ? 'text-white/80' : 'text-neutral-800'
                                )}
                            >
                                <strong>ALESTA UA</strong> — Постачальник високоякісної продукції для будівельної,
                                меблевої, машинобудівної та інших галузей. Низька вартість не гарантує якості, тому
                                ми сформували асортимент, що задовольнить потреби та бюджет будь-якого Замовника.
                            </p>

                            {/* Button */}
                            <a
                                href="/catalog"
                                className={clsx(
                                    'inline-flex items-center gap-2 text-base font-medium',
                                    isDark
                                        ? 'text-[#FFDDB8] hover:text-white underline decoration-[#D08B4C]/40 underline-offset-4'
                                        : 'text-[#D08B4C] hover:underline'
                                )}
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

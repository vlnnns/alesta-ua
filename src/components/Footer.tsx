// components/Footer.tsx
'use client'

import Link from 'next/link'
import { ChevronUp } from 'lucide-react'
import Image from 'next/image'

const accent = '#D08B4C'

export default function Footer() {
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="bg-[#151515] text-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                {/* Top */}
                <div className="grid gap-10 lg:gap-16 md:grid-cols-2 lg:grid-cols-3">
                    {/* Меню */}
                    <nav>
                        <h3 className="text-lg font-semibold mb-6">Меню</h3>
                        <ul className="space-y-4 text-neutral-300">
                            <li><Link href="/catalog" className="hover:text-white transition">Каталог</Link></li>
                            <li><Link href="/about" className="hover:text-white transition">Про нас</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition">Блог</Link></li>
                            <li><Link href="/contacts" className="hover:text-white transition">Контакти</Link></li>
                        </ul>
                    </nav>

                    {/* Контакти */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Контакти</h3>

                        <div className="space-y-5 text-sm sm:text-base">
                            <div>
                                <div className="text-neutral-400">+38 (066) 987 91 16</div>
                            </div>

                            <div>
                                <div className="font-medium">Електронна пошта:</div>
                                <a href="mailto:alesta.ply@gmail.com" className="text-neutral-300 hover:text-white transition">
                                    alesta.ply@gmail.com
                                </a>
                            </div>

                            <div>
                                <div className="font-medium">Адреса:</div>
                                <div className="text-neutral-300">Івано-Франківська обл, Угринів, калуське шосе 2 3/1</div>
                            </div>
                        </div>
                    </div>

                    {/* Правий стовпець: соцмережі, логотип, наверх */}
                    <div className="flex flex-col items-start lg:items-end gap-6">
                        {/* соц */}
                        <div className="flex items-center gap-3">
                            {/*<a*/}
                            {/*    href="https://facebook.com"*/}
                            {/*    target="_blank"*/}
                            {/*    rel="noreferrer"*/}
                            {/*    aria-label="Facebook"*/}
                            {/*    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/15 transition"*/}
                            {/*>*/}
                            {/*    /!* facebook svg *!/*/}
                            {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">*/}
                            {/*        <path d="M13.5 21v-7h2.5l.5-3h-3V9.1c0-.9.3-1.5 1.6-1.5H16V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7V11H8v3h2.2v7h3.3Z" fill="currentColor"/>*/}
                            {/*    </svg>*/}
                            {/*</a>*/}
                            {/*<a*/}
                            {/*    href="https://instagram.com"*/}
                            {/*    target="_blank"*/}
                            {/*    rel="noreferrer"*/}
                            {/*    aria-label="Instagram"*/}
                            {/*    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/15 transition"*/}
                            {/*>*/}
                            {/*    /!* instagram svg *!/*/}
                            {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">*/}
                            {/*        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>*/}
                            {/*        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>*/}
                            {/*        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>*/}
                            {/*    </svg>*/}
                            {/*</a>*/}
                        </div>

                        {/* логотип */}
                        <Link href="/" className="block">
                            {/* заміни шлях на свій файл логотипу */}
                            <Image
                                src="/logo.png"
                                alt="alesta.ua"
                                width={180}
                                height={36}
                                className="opacity-90 hover:opacity-100 transition"
                            />
                        </Link>

                        {/* наверх */}
                        <button
                            onClick={scrollTop}
                            className="
    group flex items-center gap-3 h-12 px-5 rounded-xl
    border border-white/20 hover:border-[var(--accent)] transition
    [--accent:#D08B4C]
  "
                        >
  <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25 group-hover:border-[var(--accent)] transition">
    <ChevronUp className="h-4 w-4 text-white" />
  </span>
                            <span className="text-sm text-neutral-200 group-hover:text-white">наверх</span>
                        </button>

                    </div>
                </div>

                {/* Bottom line */}
                <div className="mt-10 border-t border-white/10 pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-sm text-neutral-400">
                        <Link href="/support" className="hover:text-neutral-200 transition">Служба підтримки</Link>
                        <Link href="/privacy" className="hover:text-neutral-200 transition">Політика конфіденційності</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

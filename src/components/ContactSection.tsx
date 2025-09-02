// components/ContactSection.tsx
'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

type Props = {
    titleLeft?: string
    titleRight?: string
    description?: string
    email?: string
    phone?: string
    address?: string
    id?: string
    className?: string
}

const cardBase =
    'group relative overflow-hidden flex items-center gap-4 rounded-2xl ' +
    'border border-white/10 bg-white/10 backdrop-blur-lg transition p-5 sm:p-6 ' +
    'hover:bg-white/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D08B4C]/40'

const shineSpan =
    'pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 ' +
    'bg-gradient-to-r from-transparent via-white/30 to-transparent ' +
    'translate-x-[-120%] group-hover:translate-x-[220%] ' +
    'transition-transform duration-700 ease-out'

export default function ContactSection({
                                           titleLeft = 'ЗВ’ЯЖІТЬСЯ',
                                           titleRight = 'З НАМИ',
                                           description = 'Маєте запитання, бажаєте уточнити деталі замовлення чи отримати консультацію щодо підбору фанери? Ми завжди на зв’язку та раді допомогти!',
                                           email = 'alesta.ply@gmail.com',
                                           phone = '+38 (066) 987 91 16',
                                           address = 'Івано-Франківська обл, Угринів, калуське шосе 2 3/1',
                                           id = 'contacts',
                                           className = '',
                                       }: Props) {
    return (
        <section
            id={id}
            className={`relative px-4 sm:px-6 py-12 bg-[#151515] text-white ${className} overflow-hidden`}
        >
            <div className="relative mx-auto max-w-7xl grid items-start gap-10 lg:gap-16 grid-cols-1 lg:grid-cols-2">
                {/* Left: heading + text */}
                <div>
                    <h2 className="text-4xl sm:text-6xl font-bold leading-[1.05] tracking-[-0.01em]">
                        <span className="text-[#D08B4C]">{titleLeft}</span>{' '}
                        <span className="text-white">{titleRight}</span>
                    </h2>
                    <p className="mt-6 text-white/80 text-base sm:text-lg max-w-2xl">
                        {description}
                    </p>
                </div>

                {/* Right: cards + map */}
                <ul className="space-y-5">
                    {/* Email */}
                    <li>
                        <a href={`mailto:${email}`} className={cardBase}>
                            <span aria-hidden className={shineSpan} />
                            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-white/10 border border-white/15 text-[#D08B4C]">
                                <Mail className="w-6 h-6" />
                            </span>
                            <div className="min-w-0">
                                <div className="text-white font-semibold">Email</div>
                                <div className="truncate underline decoration-[#D08B4C]/30 underline-offset-2 transition-colors group-hover:text-[#D08B4C]">
                                    {email}
                                </div>
                            </div>
                        </a>
                    </li>

                    {/* Phone */}
                    <li>
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className={cardBase}>
                            <span aria-hidden className={shineSpan} />
                            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-white/10 border border-white/15 text-[#D08B4C]">
                                <Phone className="w-6 h-6" />
                            </span>
                            <div className="min-w-0">
                                <div className="text-white font-semibold">Phone</div>
                                <div className="truncate underline decoration-[#D08B4C]/30 underline-offset-2 transition-colors group-hover:text-[#D08B4C]">
                                    {phone}
                                </div>
                            </div>
                        </a>
                    </li>

                    {/* Address */}
                    <li>
                        <div className={`${cardBase} w-full text-left cursor-default`}>
                            <span aria-hidden className={shineSpan} />
                            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-white/10 border border-white/15 text-[#D08B4C]">
                                <MapPin className="w-6 h-6" />
                            </span>
                            <div className="min-w-0">
                                <div className="text-white font-semibold">Office</div>
                                <div className="text-white/80">{address}</div>
                            </div>
                        </div>

                        {/* Fixed Google Map iframe */}
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2620.0157689735734!2d24.6784508!3d48.9531856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4730c1544af6057b%3A0xe401c534f34ac118!2sAlesta!5e0!3m2!1sen!2sua!4v1756797133096!5m2!1sen!2sua"
                                width="600"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-[260px] sm:h-[320px]"
                            />
                            <div className="px-4 py-2 text-xs text-white/70">
                                <a
                                    href="https://goo.gl/maps/UeX9oTSSX7k3yqup6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline decoration-[#D08B4C]/40 hover:text-[#D08B4C]"
                                >
                                    Відкрити на Google Maps
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    )
}

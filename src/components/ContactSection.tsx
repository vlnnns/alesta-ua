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
                                           titleLeft = "ЗВ’ЯЖІТЬСЯ",
                                           titleRight = 'З НАМИ',
                                           description = 'Маєте запитання, бажаєте уточнити деталі замовлення чи отримати консультацію щодо підбору фанери? Ми завжди на зв’язку та раді допомогти!',
                                           email = 'info@alestaua.com',
                                           phone = '+38 (067) 767 7077',
                                           address = ' Vul. Dmytra Vitovsʹkoho,Halych, Ivano-Frankivs\'ka oblast, Ukrayna, Галич, Івано-Франківська область, 77100',
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

                {/* Right: contact cards (dark glass) */}
                <ul className="space-y-5">
                    {/* Email */}
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
                        <button type="button" className={`${cardBase} cursor-pointer w-full text-left`}>
                            <span aria-hidden className={shineSpan} />
                            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-white/10 border border-white/15 text-[#D08B4C]">
      <MapPin className="w-6 h-6" />
    </span>
                            <div className="min-w-0">
                                <div className="text-white font-semibold">Office</div>
                                <div className="text-white/80 transition-colors group-hover:text-[#D08B4C]">
                                    {address}
                                </div>
                            </div>
                        </button>
                    </li>

                </ul>
            </div>
        </section>
    )
}

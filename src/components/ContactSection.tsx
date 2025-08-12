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
    id?: string;
    className?: string
}

export default function ContactSection({
                                           titleLeft = "ЗВ’ЯЖІТЬСЯ",
                                           titleRight = 'З НАМИ',
                                           description = 'Маєте запитання, бажаєте уточнити деталі замовлення чи отримати консультацію щодо підбору фанери? Ми завжди на зв’язку та раді допомогти!',
                                           email = 'hello@relume.io',
                                           phone = '+1 (555) 000-0000',
                                           address = '123 Sample St, Sydney NSW 2000 AU',
                                           id = 'contacts',
                                           className = '',
                                       }: Props) {
    return (
        <section className={`px-4 sm:px-6 py-12 sm:py-16 bg-white ${className}`} id={id}>
            <div className="mx-auto max-w-7xl grid items-start gap-10 lg:gap-16 grid-cols-1 lg:grid-cols-2">
                {/* Left: heading + text */}
                <div>
                    <h2 className="text-4xl sm:text-6xl font-bold leading-[1.05] tracking-[-0.01em]">
                        <span className="text-[#D08B4C]">{titleLeft}</span>{' '}
                        <span className="text-neutral-900">{titleRight}</span>
                    </h2>
                    <p className="mt-6 text-neutral-700 text-base sm:text-lg max-w-2xl">
                        {description}
                    </p>
                </div>

                {/* Right: contact cards */}
                <ul className="space-y-5">
                    <li>
                        <a
                            href={`mailto:${email}`}
                            className="group flex items-center gap-4 rounded-2xl bg-neutral-100/80 hover:bg-neutral-100 transition p-5 sm:p-6"
                        >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white border border-neutral-200 text-[#D08B4C]">
                <Mail size={18} />
              </span>
                            <div className="min-w-0">
                                <div className="text-neutral-900 font-semibold">Email</div>
                                <div className="truncate underline decoration-[#D08B4C]/30 underline-offset-2 group-hover:text-[#D08B4C]">
                                    {email}
                                </div>
                            </div>
                        </a>
                    </li>

                    <li>
                        <a
                            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                            className="group flex items-center gap-4 rounded-2xl bg-neutral-100/80 hover:bg-neutral-100 transition p-5 sm:p-6"
                        >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white border border-neutral-200 text-[#D08B4C]">
                <Phone size={18} />
              </span>
                            <div className="min-w-0">
                                <div className="text-neutral-900 font-semibold">Phone</div>
                                <div className="truncate underline decoration-[#D08B4C]/30 underline-offset-2 group-hover:text-[#D08B4C]">
                                    {phone}
                                </div>
                            </div>
                        </a>
                    </li>

                    <li>
                        <div className="flex items-center gap-4 rounded-2xl bg-neutral-100/80 p-5 sm:p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white border border-neutral-200 text-[#D08B4C]">
                <MapPin size={18} />
              </span>
                            <div className="min-w-0">
                                <div className="text-neutral-900 font-semibold">Office</div>
                                <div className="text-neutral-700">{address}</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    )
}

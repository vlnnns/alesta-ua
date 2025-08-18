// app/contacts/page.tsx
import Link from 'next/link'
import ContactSection from '@/components/ContactSection'

export const metadata = {
    title: 'Контакти',
    description:
        'Зв’яжіться з нами: email, телефон та адреса офісу. Раді допомогти з підбором фанери та консультаціями.',
}

export default function ContactsPage() {
    return (
        <main className="relative bg-neutral-950 text-white overflow-x-hidden">
            {/* soft blurred accents */}

            <div className="max-w-7xl mx-auto pt-24">
                {/* breadcrumbs */}
                <nav className="text-sm text-white/60 mb-6 px-4 sm:px-6">
                    <Link href="/" className="hover:text-white cursor-pointer">Головна</Link>
                    <span className="mx-2">/</span>
                    <span className="text-white">Контакти</span>
                </nav>

                <div>
                    <ContactSection
                        id="contacts"
                        className="bg-transparent"
                        // email="sales@alesta.ua"
                        // phone="+380 (XX) XXX-XX-XX"
                        // address="вул. Прикладна, 1, Київ, Україна"
                    />
                </div>
            </div>
        </main>
    )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono, Manrope } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/SiteShell'

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['300','400','500','600','700','800'], display: 'swap', variable: '--font-manrope' })
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Фанера від виробника | Alesta',
    description: "Alesta — український виробник фанери. Висока якість, доступні ціни, доставка по Україні. Купуйте фанеру напряму від виробника без посередників.",
    keywords: "фанера, купити фанеру, фанера Україна, фанера ціна, фанера від виробника, фанера Івано-Франківськ",
    openGraph: {
        title: "Alesta — фанера від виробника",
        description: "Купуйте фанеру напряму від Alesta. Якість перевірена часом.",
        url: "https://alesta.org.ua",
        siteName: "Alesta",
        locale: "uk_UA",
        type: "website",
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk" className={manrope.variable}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteShell>{children}</SiteShell>
        </body>
        </html>
    )
}

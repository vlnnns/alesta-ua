'use client'

import { HiOutlineArrowRight } from 'react-icons/hi'

const NAV_OFFSET = 80; // висота вашого фіксованого хедера, підкоригуй за потреби

export default function Hero() {
    const scrollToQuiz = () => {
        const el = document.getElementById('quiz')
        if (!el) return
        const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET
        window.scrollTo({ top: y, behavior: 'smooth' })
    }

    return (
        <section className="h-screen w-full relative flex items-center justify-center text-white">
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero.png"
                    alt="Фанера"
                    className="object-cover w-full h-full brightness-[0.45]"
                />
            </div>

            <div className="relative z-10 text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">ФАНЕРА В РОЗДРІБ / ОПТ</h1>
                <p className="max-w-xl mx-auto text-sm md:text-lg mb-8">
                    Ми створюємо якісний матеріал, а у ваших руках і завдяки вашій фантазії вона перетворюється на справжні шедеври.
                </p>

                <button
                    onClick={scrollToQuiz}
                    className="inline-flex items-center bg-[#D08B4C] hover:bg-[#c07c3c] transition text-white px-6 py-3 rounded-md text-sm font-semibold"
                >
                    <span className="pr-4 border-r border-white/60">ПОЧАТИ ПІДБІР ТОВАРУ</span>
                    <HiOutlineArrowRight className="ml-4 text-xl" />
                </button>
            </div>
        </section>
    )
}

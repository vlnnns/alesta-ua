'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HiOutlineArrowRight } from 'react-icons/hi'

const NAV_OFFSET = 80

export default function Hero() {
    const [loaded, setLoaded] = useState(false)

    const scrollToQuiz = () => {
        const el = document.getElementById('quiz')
        if (!el) return
        const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET
        window.scrollTo({ top: y, behavior: 'smooth' })
    }

    return (
        <section className="relative flex h-screen w-full items-center justify-center text-white bg-black">
            {/* Фоновая картинка + плавное появление */}
            <div className="absolute inset-0 z-0">
                {/* Фолбек-слой, пока загружается изображение */}
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        loaded ? 'opacity-0' : 'opacity-100'
                    }`}
                    aria-hidden
                    // мягкий градиент/шум — чтобы не было чёрного провала
                    style={{
                        background:
                            'radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,0.6))',
                    }}
                />
                <Image
                    src="/hero.png"            // Убедись, что файл лежит в /public/hero.png
                    alt="Фанера"
                    fill                        // заполняет весь контейнер
                    priority                    // грузится сразу
                    sizes="100vw"
                    onLoadingComplete={() => setLoaded(true)}
                    onError={() => {
                        // чтобы не оставался черный экран, если файла нет
                        setLoaded(true)
                        console.error('Не удалось загрузить /hero.png — проверь, что файл в /public')
                    }}
                    className={`object-cover brightness-[0.45] transition-opacity duration-1000 ease-out ${
                        loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            </div>

            {/* Контент */}
            <div className="relative z-10 px-6 text-center">
                <h1 className="mb-4 text-4xl font-bold md:text-6xl">ФАНЕРА В РОЗДРІБ / ОПТ</h1>
                <p className="mx-auto mb-8 max-w-xl text-sm md:text-lg">
                    Ми створюємо якісний матеріал, а у ваших руках і завдяки вашій фантазії вона
                    перетворюється на справжні шедеври.
                </p>
                <button
                    onClick={scrollToQuiz}
                    className="inline-flex items-center rounded-md bg-[#D08B4C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c07c3c]"
                >
                    <span className="border-r border-white/60 pr-4">ПОЧАТИ ПІДБІР ТОВАРУ</span>
                    <HiOutlineArrowRight className="ml-4 text-xl" />
                </button>
            </div>
        </section>
    )
}

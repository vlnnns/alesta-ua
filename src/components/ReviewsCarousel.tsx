// components/ReviewsCarousel.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import useEmblaCarousel from 'embla-carousel-react'

const BRAND = '#D08B4C' // цвет кнопок и активной точки

const reviews = [
    { name: 'Олена, Київ',  date: '20/07/2023', rating: 5, text: 'Замовляла фанеру для дитячих іграшок — якість просто чудова! Без запаху, рівна, гарно шліфована....' },
    { name: 'Ігор, Дніпро', date: '20/07/2023', rating: 5, text: 'Брав фанеру для виготовлення меблів — залишився задоволений. Щільна, не шарпається, кромка чиста після порізки.' },
    { name: 'Марія, Львів', date: '20/07/2023', rating: 5, text: 'Крута компанія! Замовила фанеру для лазерної порізки — усе ідеально підійшло. Швидка комунікація, менеджер уважно вислухав,' },
    { name: 'Андрій, Харків', date: '21/07/2023', rating: 4, text: 'Хороша якість, трохи затримали доставку. Але менеджери попередили і компенсували знижкою.' },
]

export default function ReviewsCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    })

    // индикаторы (точки) и активный слайд
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [snapCount, setSnapCount] = useState(0)

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
        setSnapCount(emblaApi.scrollSnapList().length)
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi])

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
    const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

    const reviewLink =
        'https://www.google.com/maps/place/Alesta+UA+-+Veneer+Factory/@49.1311088,24.7397875,17z/data=!4m8!3m7!1s0x47309289333a1b33:0x899c932e327c2c18!8m2!3d49.1311088!4d24.7423624!9m1!1b1!16s%2Fg%2F11hbp9vx6w!5m1!1e4?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D'

    return (
        <section className="px-6 py-16 mx-auto bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-black">Відгуки наших клієнтів</h2>
                    {/* верхняя кнопка — только на md+ */}
                    <a
                        href={reviewLink}
                        className="hidden md:inline-flex bg-[#D08B4C] hover:bg-[#c57b37] text-white px-6 py-2 rounded-md font-medium"
                        target="_blank" rel="noopener noreferrer"
                    >
                        Залишити відгук
                    </a>
                </div>

                <div className="flex items-center gap-8 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex text-orange-400 text-2xl">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                        </div>
                        <span className="text-2xl font-bold text-[#111]">4.8</span>
                    </div>
                </div>

                {/* 🔹 мобильная карусель */}
                <div className="md:hidden">
                    {/* viewport */}
                    <div className=" px-1" ref={emblaRef}>
                        <div className="flex gap-4">
                            {reviews.map((r, i) => (
                                <div key={i} className="basis-[78%] shrink-0">
                                    <article className="bg-[#F5F5F5] rounded-xl p-4 h-full border border-black/5">
                                        <p className="font-semibold text-[#222] mb-1">{r.name}</p>
                                        <div className="flex items-center text-orange-400 mb-1">
                                            {Array.from({ length: r.rating }).map((_, idx) => <FaStar key={idx} />)}
                                            {r.rating % 1 ? <FaStarHalfAlt /> : null}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">{r.date}</p>
                                        <p className="text-gray-700 text-sm leading-relaxed">{r.text}</p>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🔸 нижняя навигация как на скрине */}
                    <div className="mt-5 flex items-center justify-start gap-5">
                        <button
                            onClick={scrollPrev}
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95"
                            style={{ backgroundColor: BRAND, color: 'white' }}
                            aria-label="Попередній"
                        >
                            <IoChevronBack size={20} />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: snapCount }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollTo(i)}
                                    aria-label={`Слайд ${i + 1}`}
                                    className="bg-gray-100 h-1.5 w-1.5 rounded-full transition-[transform,background-color]"
                                    style={{
                                        backgroundColor: i === selectedIndex ? BRAND : '#E5E7EB',
                                        transform: i === selectedIndex ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={scrollNext}
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95"
                            style={{ backgroundColor: BRAND, color: 'white' }}
                            aria-label="Наступний"
                        >
                            <IoChevronForward size={20} />
                        </button>
                    </div>

                    {/* кнопка оставить отзыв под каруселью (мобайл) */}
                    <div className="mt-6">
                        <a
                            href={reviewLink}
                            className="block w-full text-center bg-[#D08B4C] hover:bg-[#c57b37] text-white py-3 rounded-lg font-medium"
                            target="_blank" rel="noopener noreferrer"
                        >
                            Залишити відгук
                        </a>
                    </div>
                </div>

                {/* 🔹 десктоп/планшет — сетка */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((r, i) => (
                        <article key={i} className="bg-[#F5F5F5] rounded-xl p-4 h-full shadow-sm border border-black/5">
                            <p className="font-semibold text-[#222] mb-1">{r.name}</p>
                            <div className="flex items-center text-orange-400 mb-1">
                                {Array.from({ length: r.rating }).map((_, idx) => <FaStar key={idx} />)}
                                {r.rating % 1 ? <FaStarHalfAlt /> : null}
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{r.date}</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{r.text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

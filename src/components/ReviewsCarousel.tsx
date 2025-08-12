// components/ReviewsCarousel.tsx
'use client'

import {useState} from 'react'
import {FaStar, FaStarHalfAlt} from 'react-icons/fa'
import {IoChevronBack, IoChevronForward} from 'react-icons/io5'

const reviews = [
    {
        name: 'Олена, Київ',
        date: '20/07/2023',
        rating: 5,
        text: 'Замовляла фанеру для дитячих іграшок — якість просто чудова! Без запаху, рівна, гарно шліфована....'
    },
    {
        name: 'Ігор, Дніпро',
        date: '20/07/2023',
        rating: 5,
        text: 'Брав фанеру для виготовлення меблів — залишився задоволений. Щільна, не шарпається, кромка чиста після порізки.'
    },
    {
        name: 'Марія, Львів',
        date: '20/07/2023',
        rating: 5,
        text: 'Крута компанія! Замовила фанеру для лазерної порізки — усе ідеально підійшло. Швидка комунікація, менеджер уважно вислухав,'
    },
    {
        name: 'Андрій, Харків',
        date: '21/07/2023',
        rating: 4,
        text: 'Хороша якість, трохи затримали доставку. Але менеджери попередили і компенсували знижкою.'
    }
]

export default function ReviewsCarousel() {
    const [current, setCurrent] = useState(0)
    const visibleCount = 3

    const nextSlide = () => setCurrent((prev) => (prev + 1) % reviews.length)
    const prevSlide = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)

    const visibleReviews = reviews.slice(current, current + visibleCount)

    return (
        <section className="px-6 py-16 mx-auto bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-black">Відгуки наших клієнтів</h2>
                    <button className="bg-[#D08B4C] hover:bg-[#c57b37] text-white px-6 py-2 rounded-md font-medium">
                        Залишити відгук
                    </button>
                </div>

                <div className="flex items-center gap-8 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex text-orange-400 text-2xl">
                            <FaStar/><FaStar/><FaStar/><FaStar/><FaStarHalfAlt/>
                        </div>
                        <span className="text-2xl font-bold text-[#111]">4.8</span>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {visibleReviews.map((r, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                <p className="font-semibold text-[#222] mb-1">{r.name}</p>
                                <div className="flex items-center text-orange-400 mb-1">
                                    {Array.from({length: r.rating}).map((_, i) => <FaStar key={i}/>)}
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{r.date}</p>
                                <p className="text-gray-700 text-sm leading-relaxed">{r.text}</p>
                                <p className="mt-4 text-sm underline text-gray-400">Читати повністю</p>
                            </div>
                        ))}
                    </div>

                    {/* Навігація */}
                    <div className="flex justify-start items-center mt-8 gap-4">
                        <button onClick={prevSlide}
                                className="bg-[#D08B4C] text-white p-2 rounded-full hover:bg-[#c57b37]">
                            <IoChevronBack size={20}/>
                        </button>
                        <div className="flex gap-1">
                            {reviews.map((_, i) => (
                                <div key={i}
                                     className={`h-2 w-2 rounded-full ${i === current ? 'bg-[#D08B4C]' : 'bg-gray-300'}`}/>
                            ))}
                        </div>
                        <button onClick={nextSlide}
                                className="bg-[#D08B4C] text-white p-2 rounded-full hover:bg-[#c57b37]">
                            <IoChevronForward size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

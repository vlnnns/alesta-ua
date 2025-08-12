'use client'

import Image from 'next/image'
import { optionDescriptions, optionImages } from '@/data/quizOptions'

type Props = {
    option: string
    isActive: boolean
    onClick: () => void
}

export default function OptionCard({ option, isActive, onClick }: Props) {
    const img = optionImages[option]

    return (
        <button
            type="button"
            onClick={onClick}
            role="radio"
            aria-checked={isActive}
            className={`
        group relative text-left rounded-xl border overflow-hidden
        transition-all duration-200 focus:outline-none bg-white
        min-w-[170px] max-w-[170px] aspect-[5/4]
        ${isActive
                ? 'border-[#D08B4C] ring-2 ring-[#D08B4C]/30 bg-[#FFF9F3]'
                : 'border-neutral-200 hover:border-neutral-300 focus:ring-2 focus:ring-neutral-300/70'}
      `}
        >
            <div className="relative w-full h-[55%] bg-neutral-100">
                {img ? (
                    <Image
                        src={img}
                        alt={option}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 170px, 170px"
                    />
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-neutral-400 text-xs">No image</div>
                )}
                {isActive && (
                    <div className="absolute right-2 top-2 rounded-full bg-[#D08B4C] text-white text-[10px] px-2 py-0.5">
                        вибрано
                    </div>
                )}
            </div>

            <div className="h-[45%] grid content-center text-center">
                <div className="text-[11px] text-neutral-500 line-clamp-2">
                    {optionDescriptions[option] || '\u00A0'}
                </div>
                <div className="text-sm font-semibold text-neutral-900">{option}</div>
            </div>
        </button>
    )
}

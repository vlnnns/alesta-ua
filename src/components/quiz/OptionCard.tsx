// components/quiz/OptionCard.tsx
'use client'

import { optionDescriptions, optionImages } from '@/data/quizOptions'

type Props = {
    option: string
    isActive: boolean
    onToggle: () => void
}

export default function OptionCard({ option, isActive, onToggle }: Props) {
    const img = optionImages[option]

    return (
        <button
            type="button"
            onClick={onToggle}
            role="checkbox"
            aria-checked={isActive}
            className={`
        group relative text-left rounded-md border overflow-hidden
        transition-all duration-200 focus:outline-none bg-white
        min-w-[170px] max-w-[170px] aspect-[5/4]
        ${isActive
                ? 'border-[#D08B4C] ring-2 ring-[#D08B4C]/30 bg-[#FFF9F3]'
                : 'border-neutral-200 hover:border-neutral-300 focus:ring-2 focus:ring-neutral-300/70'}
      `}
        >
            <div className="relative w-full bg-neutral-100">
                {isActive && (
                    <div className="absolute right-2 top-2 rounded-full bg-[#D08B4C] text-white text-[10px] px-2 py-0.5">
                        вибрано
                    </div>
                )}
                {/* за бажанням можна вивести зображення:
        {img && <img src={img} alt="" className="w-full h-20 object-cover" />} */}
            </div>

            <div className="h-[100%] grid content-center text-center px-2">
                <div className="text-[11px] text-neutral-500 line-clamp-2">
                    {optionDescriptions[option] || '\u00A0'}
                </div>
                <div className="text-sm font-semibold text-neutral-900">{option}</div>
            </div>
        </button>
    )
}

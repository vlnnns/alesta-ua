'use client'

import Link from 'next/link'
import StepShell from '@/components/quiz/StepShell'
import ProgressBar from '@/components/quiz/ProgressBar'
import OptionCard from '@/components/quiz/OptionCard'

type Props = {
    title: string
    field: string
    options: string[]
    selectedValues: string[]
    onToggle: (value: string) => void
    onNext: () => void
    onPrev: () => void
    isFirst: boolean
    isLast: boolean
    currentStep: number
    totalSteps: number
    isLoading?: boolean
}

const SCROLL_OFFSET = 80 // налаштуй під висоту свого фіксованого хедера

export default function QuizStep({
                                     title, options, selectedValues, onToggle, onNext, onPrev,
                                     isFirst, isLast, currentStep, totalSteps, isLoading = false
                                 }: Props) {

    const scrollToQuizStart = () => {
        if (typeof window === 'undefined') return
        const el = document.getElementById('quiz')
        if (!el) return
        const y = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET
        window.scrollTo({ top: y, behavior: 'smooth' })
    }

    const handleNextClick = () => {
        scrollToQuizStart()
        onNext()
    }

    const handlePrevClick = () => {
        scrollToQuizStart()
        onPrev()
    }

    const header = (
        <>
            <div className="px-5 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <Link href="/catalog" className="text-xs text-neutral-500 sm:text-sm rounded-lg hover:text-[#D08B4C]">
                        Переглянути весь каталог
                    </Link>
                </div>
            </div>
            <h2 className="px-5 pb-4 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
                {title}
            </h2>
        </>
    )

    const canProceed = selectedValues.length > 0 && !isLoading

    const footer = (
        <div className="px-5 py-4 flex items-end justify-between">
            {!isFirst ? (
                <button
                    type="button"
                    onClick={handlePrevClick}
                    className="px-5 py-2.5 rounded-xl border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition font-medium"
                    disabled={isLoading}
                >
                    Назад
                </button>
            ) : <span />}

            <button
                type="button"
                onClick={handleNextClick}
                disabled={!canProceed}
                className={`
          px-6 py-2.5 rounded-xl text-white font-medium transition
          ${canProceed ? 'bg-[#D08B4C] hover:bg-[#c57b37]' : 'bg-neutral-300 cursor-not-allowed'}
        `}
            >
                {isLast ? (isLoading ? 'Завантаження…' : 'Завершити') : 'Далі'} →
            </button>
        </div>
    )

    return (
        // усередині QuizStep return(...)
        <StepShell header={header} footer={footer}>
            <div className="px-5 py-5">
                <div
                    className="
        grid grid-cols-2 gap-3
        sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5
        "
                    role="group"
                    aria-label={`${title} (мультивибір)`}
                    aria-multiselectable="true"
                >
                    {options.map((option) => (
                        <OptionCard
                            key={option}
                            option={option}
                            isActive={selectedValues.includes(option)}
                            onToggle={() => onToggle(option)}
                        />
                    ))}
                </div>
            </div>
        </StepShell>

    )
}

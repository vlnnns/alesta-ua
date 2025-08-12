'use client'

import { useMemo } from 'react'
import StepShell from '@/components/quiz/StepShell'
import ProgressBar from '@/components/quiz/ProgressBar'
import OptionCard from '@/components/quiz/OptionCard'

type Props = {
    title: string
    field: string
    options: string[]
    selectedValue?: string
    onChange: (value: string) => void
    onNext: () => void
    onPrev: () => void
    isFirst: boolean
    isLast: boolean
    currentStep: number
    totalSteps: number
}

export default function QuizStep({
                                     title, options, selectedValue, onChange, onNext, onPrev,
                                     isFirst, isLast, currentStep, totalSteps
                                 }: Props) {

    const header = (
        <>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            <h2 className="px-5 pb-4 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
                {title}
            </h2>
        </>
    )

    const footer = (
        <div className="px-5 py-4 flex items-end justify-between">
            {!isFirst ? (
                <button
                    type="button"
                    onClick={onPrev}
                    className="px-5 py-2.5 rounded-xl border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition font-medium"
                >
                    Назад
                </button>
            ) : <span />}

            <button
                type="button"
                onClick={onNext}
                disabled={!selectedValue}
                className={`
          px-6 py-2.5 rounded-xl text-white font-medium transition
          ${selectedValue ? 'bg-[#D08B4C] hover:bg-[#c57b37]' : 'bg-neutral-300 cursor-not-allowed'}
        `}
            >
                {isLast ? 'Завершити' : 'Далі'} →
            </button>
        </div>
    )

    return (
        <StepShell header={header} footer={footer}>
            <div className="px-5 py-5">
                <div className="flex flex-wrap justify-center gap-4" role="radiogroup" aria-label={title}>
                    {options.map((option) => (
                        <OptionCard
                            key={option}
                            option={option}
                            isActive={selectedValue === option}
                            onClick={() => onChange(option)}
                        />
                    ))}
                </div>
            </div>
        </StepShell>
    )
}

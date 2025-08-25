'use client'

type Props = { currentStep: number; totalSteps: number }

export default function ProgressBar({ currentStep, totalSteps }: Props) {
    const percent = Math.round(((currentStep + 1) / totalSteps) * 100)
    return (
        <div className="flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-neutral-500">
                крок <span className="font-medium text-neutral-800">{currentStep + 1}</span> з {totalSteps}
            </p>
            <div className="flex items-center gap-3 min-w-[140px] w-1/2 max-w-xs">
                <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-[#D08B4C] transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-xs text-neutral-600 w-8 text-right">{percent}%</span>
            </div>
        </div>
    )
}

'use client'

import { useMemo, useState } from 'react'
import type { PlywoodProduct as DbProduct } from '@prisma/client'
import QuizStep from '@/components/quiz/QuizStep'
import ResultsGrid from '@/components/quiz/ResultsGrid'

type Answers = {
    type: string[]
    thickness: string[]
    format: string[]
    grade: string[]
}

type StepDef = {
    title: string
    field: keyof Answers
    options: string[]
}

type ApiProduct = Omit<DbProduct, 'createdAt' | 'updatedAt'> & {
    createdAt?: string
    updatedAt?: string
    image?: string | null
    inStock?: boolean | null
}

export default function QuizPage() {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Answers>({
        type: [], thickness: [], format: [], grade: []
    })
    const [results, setResults] = useState<DbProduct[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const baseSteps: StepDef[] = [
        { title: 'Оберіть тип фанери', field: 'type',      options: ['ФСФ','ФК','ФКМ','Ламінована','Для Лазера','Транспортна','Для Опалубки'] },
        { title: 'Яку товщину ви розглядаєте?', field: 'thickness', options: ['9','12','15','18','21'] },
        { title: 'Оберіть формат', field: 'format',         options: ['900x600','1525x1525','2500x1250','3000x1500'] },
        { title: 'Оберіть сорт фанери', field: 'grade',     options: ['B/B (1/1)','B/BB (1/2)','BB/BB (2/2)','BB/C (2/4)','C/C (4/4)','CP/C (3/4)'] },
    ]

    // прибираємо «меблеву» і ФКМ з опцій
    const steps: StepDef[] = useMemo(
        () => baseSteps.map(s => ({ ...s, options: s.options.filter(o => !/мебл/i.test(o) && o !== 'ФКМ') })),
        []
    )

    const handleToggle = (value: string) => {
        const field = steps[step].field
        setAnswers(prev => {
            const arr = prev[field]
            const nextArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
            return { ...prev, [field]: nextArr }
        })
    }

    const fetchResults = async () => {
        try {
            setLoading(true); setError(null)

            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answers),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const json = (await res.json()) as unknown
            const arr = Array.isArray(json) ? (json as ApiProduct[]) : []

            const normalized: DbProduct[] = arr.map(p => ({
                id: Number(p.id),
                type: String(p.type ?? ''),
                thickness: Number(p.thickness ?? 0),
                format: String(p.format ?? ''),
                grade: String(p.grade ?? ''),
                manufacturer: String(p.manufacturer ?? ''),
                waterproofing: String(p.waterproofing ?? ''),
                price: Number(p.price ?? 0),
                image: p.image ?? '',
                inStock: p.inStock ?? true,
                createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
                updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            }))

            setResults(normalized)
            setStep(steps.length) // показуємо результати тільки після завантаження
        } catch (e) {
            setError('Сталася помилка під час завантаження рекомендацій.')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        const isLast = step === steps.length - 1
        if (isLast) {
            // НЕ міняємо step — лишаємось на поточному місці, показуємо оверлей
            void fetchResults()
        } else {
            setStep(prev => Math.min(prev + 1, steps.length))
        }
    }

    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0))

    const currentField = steps[step]?.field
    const currentValues = (currentField ? answers[currentField] : []) ?? []

    return (
        <div className="mx-auto px-6 py-12 bg-white flex flex-col items-center" id="quiz">
            {/* Header */}
            <div className="text-center max-w-5xl mx-auto mb-10">
                <h1 className="text-2xl sm:text-5xl font-extrabold leading-tight text-black">
                    Обери ідеальний виріб — <span className="block md:inline">у кілька кліків</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-500 mt-4">
                    Пройди короткий квіз і ми підберемо для тебе найкращий варіант із нашої колекції.
                </p>
            </div>

            {/* Зона під крок/результати */}
            <div className="min-h-[520px] flex items-stretch justify-center w-full max-w-5xl">
                {step < steps.length ? (
                    // кроки: показуємо оверлей-лоадер поверх, щоб не зсувало екран
                    <div className="relative w-full">
                        <QuizStep
                            title={steps[step].title}
                            field={currentField}
                            options={steps[step].options}
                            selectedValues={currentValues}
                            onToggle={handleToggle}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            isFirst={step === 0}
                            isLast={step === steps.length - 1}
                            currentStep={step}
                            totalSteps={steps.length}
                            isLoading={loading}
                        />
                        {loading && (
                            <div className="absolute inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm">
                                <p className="text-sm text-neutral-700">Завантаження рекомендацій…</p>
                            </div>
                        )}
                    </div>
                ) : error ? (
                    <div className="w-full grid place-items-center py-16">
                        <p className="text-center text-red-600">{error}</p>
                        <button
                            onClick={() => { setStep(steps.length - 1); setError(null) }}
                            className="mt-4 px-6 py-2 rounded-md border border-black text-black hover:bg-black hover:text-white transition"
                        >
                            ← Повернутись назад
                        </button>
                    </div>
                ) : results.length > 0 ? (
                    <ResultsGrid
                        items={results}
                        filters={answers}
                        onEditFilters={() => setStep(steps.length - 1)}
                    />
                ) : (
                    <div className="w-full grid place-items-center py-16">
                        <p className="text-center text-gray-600">Нічого не знайдено.</p>
                        <button
                            onClick={() => setStep(steps.length - 1)}
                            className="mt-4 px-6 py-2 rounded-md border border-black text-black hover:bg-black hover:text-white transition"
                        >
                            ← Змінити параметри
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

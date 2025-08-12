'use client'

import { useEffect, useState } from 'react'
import QuizStep from '@/components/quiz/QuizStep'
import ResultsGrid from '@/components/quiz/ResultsGrid'

type PlywoodProduct = {
    id: number
    type: string
    thickness: number
    format: string
    grade: string
    manufacturer: string
    waterproofing: string
    price: number
    image: string
}

type Answers = {
    type: string
    thickness: string
    format: string
    grade: string
    manufacturer: string
}

export default function QuizPage() {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Answers>({
        type: '', thickness: '', format: '', grade: '', manufacturer: ''
    })
    const [results, setResults] = useState<PlywoodProduct[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const steps = [
        { title: 'Оберіть тип фанери', field: 'type', options: ['ФСФ','ФК','ФКМ','Ламінована','Для Лазера','Транспортна','Для Опалубки'] },
        { title: 'Яку товщину ви розглядаєте?', field: 'thickness', options: ['9','12','15','18','21'] },
        { title: 'Оберіть формат', field: 'format', options: ['900x600','1525x1525','2500x1250','3000x1500'] },
        { title: 'Оберіть сорт фанери', field: 'grade', options: ['B/B (1/1)','B/BB (1/2)','BB/BB (2/2)','BB/C (2/4)','C/C (4/4)','CP/C (3/4)'] },
        { title: 'Оберіть виробника', field: 'manufacturer', options: ['Україна','Польща','Китай','Kronospan','Одек'] }
    ]

    const handleChange = (value: string) => {
        const field = steps[step].field as keyof Answers
        setAnswers(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => setStep(prev => prev + 1)
    const handlePrev = () => setStep(prev => prev - 1)

    useEffect(() => {
        if (step !== steps.length) return
        const fetchResults = async () => {
            try {
                setLoading(true); setError(null)
                const res = await fetch('/api/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(answers)
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                setResults(Array.isArray(data) ? data : [])
            } catch (e) {
                setError('Сталася помилка під час завантаження рекомендацій.')
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

    const currentField = steps[step]?.field
    const currentValue = (currentField ? answers[currentField as keyof Answers] : '') ?? ''

    return (
        <div className="mx-auto px-4 py-12 bg-white flex flex-col items-center">
            {/* Header */}
            <div className="text-center max-w-5xl mx-auto mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-black">
                    Обери ідеальний виріб — у кілька кліків
                </h1>
                <p className="text-base sm:text-lg text-gray-500 mt-4">
                    Пройди короткий квіз і ми підберемо для тебе найкращий варіант із нашої колекції.
                </p>
            </div>

            {/* Card container: одна высота для шагов и результатов */}
            <div className="min-h-[520px] flex items-stretch justify-center w-full max-w-5xl">
                {step < steps.length ? (
                    <div className="w-full">
                        <QuizStep
                            title={steps[step].title}
                            field={currentField}
                            options={steps[step].options}
                            selectedValue={currentValue}
                            onChange={handleChange}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            isFirst={step === 0}
                            isLast={step === steps.length - 1}
                            currentStep={step}
                            totalSteps={steps.length}
                        />
                    </div>
                ) : loading ? (
                    <div className="w-full grid place-items-center py-16">
                        <p className="text-center text-gray-600">Завантаження рекомендацій...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : results.length > 0 ? (
                    <ResultsGrid
                        items={results}
                        onEditFilters={() => setStep(steps.length - 1)}
                    />
                ) : (
                    <div className="text-center text-gray-600 flex flex-col items-center justify-center w-full py-12">
                        <p className="text-lg font-medium mb-2">Не знайдено відповідних товарів 😔</p>
                        <p className="text-sm text-gray-400 mb-6">Спробуйте змінити один з параметрів підбору.</p>
                        <button
                            onClick={() => setStep(steps.length - 1)}
                            className="px-6 py-2 rounded-md border border-black text-black hover:bg-black hover:text-white transition"
                        >
                            ← Повернутись назад
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

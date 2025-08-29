// components/catalog/FiltersBar.tsx
'use client'

import SingleFilterPicker from './SingleFilterPicker'

export default function FiltersBar({
                                       types, thicknesses, formats, grades, waterproofings,
                                   }: {
    types: string[]
    thicknesses: number[]
    formats: string[]
    grades: string[]
    manufacturers: string[]
    waterproofings: string[]
}) {
    // відсортуємо товщини красиво
    const th = [...thicknesses].sort((a,b)=>a-b).map(v => `${v} мм`)

    return (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <SingleFilterPicker param="type"          label="Тип:"            options={types}           />
            <SingleFilterPicker param="thickness"     label="Товщина:"        options={th}              />
            <SingleFilterPicker param="format"        label="Формат:"         options={formats}         />
            <SingleFilterPicker param="grade"         label="Сорт:"           options={grades}          />
            <SingleFilterPicker param="waterproofing" label="Вологозахист:"   options={waterproofings}  />
        </div>
    )
}

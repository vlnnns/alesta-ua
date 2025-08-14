'use client'

type Product = {
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

type Props = {
    items: Product[]
    onEditFilters?: () => void
    title?: string
}

export default function ResultsGrid({ items, onEditFilters, title = 'Результати підбору' }: Props) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">{title}</h2>
                {onEditFilters && (
                    <button
                        onClick={onEditFilters}
                        className="px-4 py-2 rounded-lg border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition"
                    >
                        ← Змінити параметри
                    </button>
                )}
            </div>

            <div className="grid gap-6 w-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                {items.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl overflow-hidden border hover:shadow-md transition h-full flex flex-col"
                    >
                        <div className="w-full aspect-[4/3] bg-gray-100 relative">
                            <img
                                src={product.image}
                                alt={product.type}
                                className="absolute inset-0 w-full h-full object-contain p-4"
                                loading="lazy"
                            />
                        </div>

                        <div className="p-4 flex flex-col gap-2 flex-1">
                            <h3 className="font-semibold text-sm text-black line-clamp-2">
                                {`Фанера ${product.type} ${product.thickness} мм`}
                            </h3>
                            <p className="text-xs text-gray-500">{product.grade}</p>
                            <p className="text-xs text-gray-500">{product.format}</p>
                            <p className="text-xs text-gray-500">{product.manufacturer}</p>

                            <div className="mt-auto" />

                            <div className="flex items-center justify-between pt-2">
                <span className="text-base font-bold text-black whitespace-nowrap">
                  ₴{product.price} / лист
                </span>
                                <button
                                    className="bg-[#D08B4C] hover:bg-[#c57b37] text-white text-lg font-bold rounded-lg w-10 h-10 grid place-items-center"
                                    aria-label="Додати"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// components/TrustedPartnerSection.tsx
type Props = { id?: string; className?: string }

export default function TrustedPartnerSection({
                                                  id = 'partners',
                                                  className = '',
                                              }: Props) {
    return (
        <section className={`bg-[url('/about.png')] bg-cover bg-center py-16 px-6 md:px-16 ${className}`} id={id}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Left Side */}
                <div className="flex-1">
                    <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                        <span className="text-[#D08B4C]">НАДІЙНИЙ</span> ПАРТНЕР <br /> У СВІТІ МАТЕРІАЛІВ
                    </h2>
                </div>

                {/* Right Side */}
                <div className="flex-1 bg-white rounded-xl p-6 md:p-10 shadow-md">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#D08B4C] bg-opacity-90 text-white text-center py-6 px-3 rounded-md">
                            <h3 className="text-2xl font-bold">25+</h3>
                            <p className="text-sm">років стабільної роботи на ринку</p>
                        </div>
                        <div className="bg-[#D08B4C] bg-opacity-90 text-white text-center py-6 px-3 rounded-md">
                            <h3 className="text-2xl font-bold">100%</h3>
                            <p className="text-sm">натуральна деревина без токсинів</p>
                        </div>
                        <div className="bg-[#D08B4C] bg-opacity-90 text-white text-center py-6 px-3 rounded-md">
                            <h3 className="text-2xl font-bold">12</h3>
                            <p className="text-sm">типів матеріалів в асортименті</p>
                        </div>
                        <div className="bg-[#D08B4C] bg-opacity-90 text-white text-center py-6 px-3 rounded-md">
                            <h3 className="text-2xl font-bold">98%</h3>
                            <p className="text-sm">клієнтів звертаються повторно</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-black leading-relaxed mb-4">
                        <strong>ALESTA UA</strong> — Постачальник високоякісної продукції для будівельної,
                        меблевої, машинобудівної та інших галузей. Сьогодні основним критерієм вибору постачальника
                        часто вважається найнижча ціна матеріалів, що не завжди є виправданим. Низька вартість не
                        гарантує високої якості продукції. Ми сформували асортимент продукції, що здатен
                        задовольнити потреби та бюджет будь-якого Замовника.
                    </p>

                    {/* Button */}
                    <a
                        href="#products"
                        className="inline-flex items-center gap-2 text-[#D08B4C] font-medium text-base hover:underline"
                    >
                        Переглянути всю продукцію →
                    </a>
                </div>
            </div>
        </section>
    )
}

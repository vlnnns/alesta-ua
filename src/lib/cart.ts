export type CartItem = {
    id: string;            // составной ключ (productId + варианты)
    productId: number;
    image: string;
    title: string;         // напр. "Фанера ФК 12 мм"
    price: number;         // за лист
    quantity: number;

    // варианты/атрибуты
    type: string;
    thickness: number;
    format: string;
    grade: string;
    manufacturer: string;
    waterproofing: string;
};

export function makeCartItemId(input: {
    productId: number;
    type: string;
    thickness: number;
    format: string;
    grade: string;
    manufacturer: string;
    waterproofing: string;
}) {
    const parts = [
        input.productId,
        input.type,
        input.thickness,
        input.format,
        input.grade,
        input.manufacturer,
        input.waterproofing,
    ];
    return parts.map(String).join('|');
}

export function calcSubtotal(items: CartItem[]) {
    return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

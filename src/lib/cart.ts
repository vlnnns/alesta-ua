export type CartItem = {
    id: string;          // id строки корзины (уникальный ключ для UI)
    productId: number;   // <-- добавить: реальный id товара
    title: string;
    image: string;
    price: number;
    quantity: number;
    type: string;
    thickness: number;
    format: string;
    grade: string;
    manufacturer: string;
    waterproofing: string;
}


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

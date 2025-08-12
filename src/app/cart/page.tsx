import CartPageClient from '@/components/cart/CartPageClient'

export const metadata = {
    title: 'Кошик',
    description: 'Ваші товари',
}

export default function CartPage() {
    // Никаких хуков тут — просто рендерим клиентский компонент
    return <CartPageClient />
}

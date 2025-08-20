import type { CheckoutPayload } from '@/app/checkout/actions'

export function orderConfirmation(
    id: number,
    payload: CheckoutPayload
) {
    const { customerName, phone, email, city, address, warehouse, comment, items, total } = payload

    const rows = items.map((it) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.title}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">₴${it.price}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">₴${it.price * it.quantity}</td>
    </tr>
  `).join('')

    const totalFmt = new Intl.NumberFormat('uk-UA').format(total)

    const html = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#111;padding:16px">
    <h2 style="margin:0 0 8px">Дякуємо за замовлення №${id}</h2>
    <p style="margin:0 0 16px">Ми прийняли ваше замовлення і скоро з вами звʼяжемось.</p>

    <h3 style="margin:16px 0 8px">Склад замовлення</h3>
    <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <thead>
        <tr>
          <th align="left" style="padding:8px;border-bottom:1px solid #ddd">Товар</th>
          <th align="left" style="padding:8px;border-bottom:1px solid #ddd">К-сть</th>
          <th align="left" style="padding:8px;border-bottom:1px solid #ddd">Ціна</th>
          <th align="left" style="padding:8px;border-bottom:1px solid #ddd">Сума</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" align="right" style="padding:12px 8px;font-weight:600">Разом:</td>
          <td style="padding:12px 8px;font-weight:700">₴${totalFmt}</td>
        </tr>
      </tfoot>
    </table>

    <h3 style="margin:16px 0 8px">Контакти</h3>
    <p style="margin:0 0 4px"><b>ПІБ:</b> ${customerName}</p>
    <p style="margin:0 0 4px"><b>Телефон:</b> ${phone}</p>
    <p style="margin:0 0 4px"><b>Email:</b> ${email}</p>

    <h3 style="margin:16px 0 8px">Доставка</h3>
    <p style="margin:0 0 4px"><b>Місто:</b> ${city}</p>
    ${address ? `<p style="margin:0 0 4px"><b>Адреса:</b> ${address}</p>` : ''}
    ${warehouse ? `<p style="margin:0 0 4px"><b>Відділення:</b> ${warehouse}</p>` : ''}

    ${comment ? `<h3 style="margin:16px 0 8px">Коментар</h3><p>${comment}</p>` : ''}

    <p style="margin:16px 0 0;color:#666">Якщо це були не ви — просто ігноруйте лист.</p>
  </div>
  `

    const text = [
        `Дякуємо за замовлення №${id}`,
        '',
        'Склад замовлення:',
        ...items.map(it => `• ${it.title} ×${it.quantity} — ₴${it.price * it.quantity}`),
        `Разом: ₴${totalFmt}`,
        '',
        'Контакти:',
        `ПІБ: ${customerName}`,
        `Телефон: ${phone}`,
        `Email: ${email}`,
        'Доставка:',
        `Місто: ${city}`,
        address ? `Адреса: ${address}` : '',
        warehouse ? `Відділення: ${warehouse}` : '',
        comment ? `Коментар: ${comment}` : '',
    ].filter(Boolean).join('\n')

    return {
        subject: `ALÉSTA — підтвердження замовлення №${id}`,
        html,
        text,
    }
}

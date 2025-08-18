import { prisma } from '@/lib/prisma'

function csvEscape(v: unknown) {
    if (v === null || v === undefined) return ''
    const s = String(v).replace(/"/g, '""')
    return `"${s}"`
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '30d'
    const now = new Date()
    let from = new Date(now)
    if (range.endsWith('d')) {
        const days = parseInt(range)
        from.setDate(from.getDate() - (Number.isFinite(days) ? days : 30))
    } else {
        // custom 'from' / 'to' like ?from=2025-08-01&to=2025-08-18
        const f = searchParams.get('from'); const t = searchParams.get('to')
        if (f) from = new Date(f)
        if (t) now.setTime(new Date(t).getTime())
    }

    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: from, lte: now } },
        include: { items: true },
        orderBy: { id: 'desc' },
    })

    const headers = [
        'orderId','createdAt','customerName','phone','email','city','address','warehouse',
        'deliveryMethod','total',
        'itemId','productId','title','price','quantity','type','thickness','format','grade','manufacturer','waterproofing'
    ]

    const rows: string[] = []
    rows.push(headers.join(','))

    for (const o of orders) {
        for (const it of o.items) {
            rows.push([
                csvEscape(o.id),
                csvEscape(o.createdAt?.toISOString?.() ?? ''),
                csvEscape(o.customerName),
                csvEscape(o.phone),
                csvEscape(o.email),
                csvEscape(o.city),
                csvEscape(o.address ?? ''),
                csvEscape(o.warehouse ?? ''),
                csvEscape(o.deliveryMethod),
                csvEscape(o.total),
                csvEscape(it.id),
                csvEscape(it.productId),
                csvEscape(it.title),
                csvEscape(it.price),
                csvEscape(it.quantity),
                csvEscape(it.type ?? ''),
                csvEscape(it.thickness ?? ''),
                csvEscape(it.format ?? ''),
                csvEscape(it.grade ?? ''),
                csvEscape(it.manufacturer ?? ''),
                csvEscape(it.waterproofing ?? ''),
            ].join(','))
        }
    }

    const csv = rows.join('\r\n')
    const filename = `orders_${new Date().toISOString().slice(0,10)}_${range}.csv`

    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-store',
        },
    })
}

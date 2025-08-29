import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.blogPost.upsert({
        where: { slug: 'ispm-15-certification-what-it-means' },
        update: {},
        create: {
            slug: 'ispm-15-certification-what-it-means',
            title: 'Сертифікація ISPM 15: що це означає на практиці',
            excerpt:
                'ISPM 15 — міжнародний фітосанітарний стандарт для деревʼяної тари. Розбираємося, коли він потрібен, як читається маркування IPPC, які методи обробки існують та чому фанера/OSB зазвичай звільнені.',
            coverImage: null,            // можеш замінити на свій банер
            category: 'Сертифікація',
            featured: false,
            published: true,
            publishedAt: new Date(),
            bodyHtml: `
<section>
  <p>
    <strong>ISPM 15</strong> — це міжнародний фітосанітарний стандарт для
    деревʼяного пакувального матеріалу, який використовується при міжнародних
    відправленнях. Його мета — не допустити поширення шкідників разом із
    тарою (палети, ящики, дрантя тощо).
  </p>
</section>

<section>
  <h2>Коли потрібен ISPM 15</h2>
  <ul>
    <li>для <strong>міжнародних відправлень</strong> у деревʼяній тарі з масиву (товщина &gt; 6&nbsp;мм);</li>
    <li>для палет, ящиків, підкладок/дрантя (dunnage), що супроводжують вантаж;</li>
    <li>не потрібен для внутрішніх перевезень в межах країни.</li>
  </ul>
</section>

<section>
  <h2>Хто звільнений від ISPM 15</h2>
  <p>
    Стандарт <em>не поширюється</em> на деревні матеріали, які перероблені таким
    чином, що вважаються вільними від шкідників: <strong>фанера, OSB, MDF, ДВП</strong>,
    інші плити, а також тара з <strong>картону, пластику, металу</strong>.
  </p>
</section>

<section>
  <h2>Методи обробки</h2>
  <ul>
    <li><strong>HT</strong> (Heat Treatment) — термообробка: нагрів до щонайменше
      <strong>56&nbsp;°C</strong> у серцевині деревини протягом <strong>30 хв</strong>.</li>
    <li><strong>MB</strong> (Methyl Bromide) — фумігація метилбромідом
      (у багатьох країнах обмежена/заборонена, рекомендовано HT).</li>
  </ul>
</section>

<section>
  <h2>Маркування IPPC: як читати</h2>
  <p>На тарі ставиться прямокутний знак із «колоском» IPPC. Приклад:</p>
  <pre style="background:#f6f6f6;padding:12px;border-radius:8px;">XX-000 HT KD</pre>
  <ul>
    <li><strong>XX</strong> — код країни (наприклад, UA, PL, TR);</li>
    <li><strong>000</strong> — унікальний номер виробника/оператора обробки;</li>
    <li><strong>HT</strong> — метод: термообробка; <strong>MB</strong> — фумігація;</li>
    <li><strong>KD</strong> — інколи додають «kiln dried» (камерна сушка).</li>
  </ul>
</section>

<section>
  <h2>Що це означає для клієнтів Alesta</h2>
  <ul>
    <li>Якщо ви <strong>експортуєте</strong> продукцію, перевіряйте, щоб палети/ящики мали дійсне
      маркування IPPC за ISPM 15.</li>
    <li><strong>Фанера, OSB, MDF</strong> як матеріал не потребують маркування ISPM 15 —
      вимоги стосуються саме <em>деревʼяної тари з масиву</em>.</li>
    <li>За потреби допоможемо підібрати сертифіковану тару для відвантажень.</li>
  </ul>
</section>

<section>
  <h2>Питання-відповіді</h2>
  <p><strong>Чи потрібен ISPM 15 на саму фанеру?</strong><br/>
     Ні. Фанера та інші інженерні плити звільнені. Сертифікація потрібна для
     деревʼяної тари з масиву при міжнародних відправленнях.</p>
  <p><strong>А якщо відправляю по Україні?</strong><br/>
     ISPM 15 не вимагається для внутрішніх перевезень.</p>
  <p><strong>Який метод кращий?</strong><br/>
     Рекомендовано <strong>HT</strong> (термообробка). Фумігація MB у ряді країн
     обмежена.</p>
</section>
      `.trim(),
        },
    })

    console.log('✓ Blog post seeded: ispm-15-certification-what-it-means')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.blogPost.upsert({
        where: { slug: 'fsf-vs-fk-riznytsia-ta-vybir' },
        update: {},
        create: {
            slug: 'fsf-vs-fk-riznytsia-ta-vybir',
            title: 'ФСФ vs ФК: у чому різниця і що обрати?',
            category: 'Гід по вибору',
            featured: false,
            published: true,
            publishedAt: new Date(),
            coverImage: null, // за потреби додай власний банер
            excerpt:
                'Пояснюємо різницю між фанерою ФСФ та ФК: тип клею, вологостійкість, міцність і реальні сценарії використання. Поради для вибору під покрівлю, підлогу, меблі чи опалубку.',

            bodyHtml: `
<section>
  <p>
    При виборі фанери перше запитання — <strong>який тип клею</strong> і як це
    впливає на <strong>вологостійкість</strong> та сферу застосування. Найпоширеніші
    варіанти — <strong>ФСФ</strong> та <strong>ФК</strong>. Нижче — просте порівняння,
    яке допоможе обрати матеріал під ваше завдання.
  </p>
</section>

<section>
  <h2>Коротко про головне</h2>
  <ul>
    <li><strong>ФСФ</strong> — підвищена водостійкість, витримує складні умови зовні та вологі середовища.</li>
    <li><strong>ФК</strong> — вологостійка фанера для інтер’єру: меблі, оздоблення, сухі/помірно вологі приміщення.</li>
  </ul>
</section>

<section>
  <h2>Порівняння ФСФ і ФК</h2>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr>
        <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px">Критерій</th>
        <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px">ФСФ</th>
        <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px">ФК</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Вологостійкість</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0"><strong>Висока</strong> (підвищена водостійкість)</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0"><strong>Середня</strong> (вологостійка)</td>
      </tr>
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Сфера застосування</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Опалубка, підлоги, покрівельна основа, транспорт/тара, вуличні роботи</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Меблі, інтер’єрні панелі, оздоблення, DIY у приміщенні</td>
      </tr>
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Міцність/жорсткість</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Підвищена, стабільна під навантаженнями</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Достатня для інтер’єрних задач</td>
      </tr>
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Де краще не використовувати</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Витончені інтер’єрні фасади, де критична мінімальна емісія — краще спеціальні плити/шпон</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0">Позаприміщенням та у зонах постійної вологи</td>
      </tr>
    </tbody>
  </table>
</section>

<section>
  <h2>Що обрати в типових сценаріях</h2>
  <ul>
    <li><strong>Основа під покрівлю, підлога у підсобних приміщеннях, чорнова підлога:</strong> ФСФ.</li>
    <li><strong>Опалубка, тимчасові конструкції:</strong> ФСФ (можна брати ламіновану для більшої зносостійкості).</li>
    <li><strong>Меблі, полиці, оздоблення стін у житлових кімнатах:</strong> ФК.</li>
    <li><strong>DIY у квартирі (декор, прості предмети):</strong> ФК.</li>
  </ul>
</section>

<section>
  <h2>Товщини та формати</h2>
  <p>
    Найпоширеніші формати: <em>1525×1525, 2500×1250, 3000×1500</em>. Точний набір залежить від типу фанери та партії.
    Для жорстких основ (підлога, дах) зазвичай беруть <strong>18–21&nbsp;мм</strong>, для меблевих корпусів — <strong>12–18&nbsp;мм</strong>,
    для декоративних панелей — <strong>6–10&nbsp;мм</strong>.
  </p>
</section>

<section>
  <h2>Поради з монтажу</h2>
  <ul>
    <li>Під час зовнішніх робіт крайки захищайте фарбою/лаком — це подовжує ресурс.</li>
    <li>Використовуйте еластичні клеї/герметики у вузлах, де можливі деформації.</li>
    <li>Залишайте компенсаційні шви 2–3&nbsp;мм між листами на великій площі.</li>
  </ul>
</section>

<section>
  <h2>Питання та відповіді</h2>
  <p><strong>Чи можна ФК у ванній?</strong><br/> Краще уникати тривалої прямої вологи; для таких зон обирайте ФСФ або інші матеріали з вищою вологостійкістю.</p>
  <p><strong>Чи обовʼязково брати ламіновану?</strong><br/> Для опалубки та інтенсивного зносу — так, ламінована поверхня служить довше і легше очищується.</p>
</section>

<section>
  <h2>Перейти до каталогу</h2>
  <p>
    <a href="/catalog?type=%D0%A4%D0%A1%D0%A4">Подивитися ФСФ</a> ·
    <a href="/catalog?type=%D0%A4%D0%9A">Подивитися ФК</a>
  </p>
</section>
      `.trim(),
        },
    })

    console.log('✓ Blog post seeded: fsf-vs-fk-riznytsia-ta-vybir')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
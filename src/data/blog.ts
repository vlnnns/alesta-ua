// data/blog.ts
export type BlogPost = {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    cover: string        // путь к обложке
    bodyHtml: string     // можно заменить на markdown в будущем
    publishedAt: string  // ISO
}

export const blogPosts: BlogPost[] = [
    {
        id: 'p1',
        slug: 'diy-prosti-rishennya-dlya-domu',
        title: 'Зроби сам: прості рішення для дому',
        excerpt:
            'Підбір простих DIY-проєктів із фанери: швидко, стильно та бюджетно. Посилання на креслення й поради з обробки.',
        category: 'DIY та натхнення',
        cover: '/images/blog/hero-diy.jpg',
        bodyHtml: `
      <p>Це велика добірка практичних ідей з фанери для дому. Ми покажемо, як зібрати полиці, органайзери, рамки та декор.</p>
      <p>Поради з вибору товщини, сорту, формату і кріплення — всередині.</p>
    `,
        publishedAt: '2025-08-01'
    },
    {
        id: 'p2',
        slug: 'ispm-15-certification-what-it-means',
        title: 'Сертифікація ISPM 15: що це означає на практиці',
        excerpt:
            'ISPM 15 — міжнародний фітосанітарний стандарт для деревʼяної тари. Розбираємося, коли він потрібен, як читається маркування IPPC, які методи обробки існують та чому фанера/OSB зазвичай звільнені.',
        category: 'DIY та натхнення',
        cover: '/images/blog/organizer-1.jpg',
        bodyHtml: `
      <p>Крок за кроком робимо компактну поличку для столу. Розміри та розкрій додаємо в кінці статті.</p>
    `,
        publishedAt: '2025-08-05'
    },
    {
        id: 'p3',
        slug: 'fsf-vs-fk-riznytsia-ta-vybir',
        title: 'ФСФ vs ФК: у чому різниця і що обрати?',
        excerpt:
            'Пояснюємо різницю між фанерою ФСФ та ФК: тип клею, вологостійкість, міцність і реальні сценарії використання. Поради для вибору під покрівлю, підлогу, меблі чи опалубку.',
        category: 'DIY та натхнення',
        cover: '/images/blog/organizer-2.jpg',
        bodyHtml: `
      <p>Покажемо кілька варіантів дизайну, що робляться з одного листа фанери.</p>
    `,
        publishedAt: '2025-08-09'
    }
]

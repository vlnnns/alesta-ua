// Превращаем обычный текст в безопасный HTML:
// - экранируем спецсимволы
// - пустая строка = новый абзац <p>
// - одиночные переносы внутри абзаца = <br>
export function escapeHtml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export function plainToHtml(input: string) {
    const blocks = input.trim().split(/\n{2,}/) // абзацы разделены пустой строкой
    return blocks
        .map(b => `<p>${escapeHtml(b).replace(/\n/g, '<br/>')}</p>`)
        .join('\n')
}

// Для заполнения формы из уже сохранённого bodyHtml (чтобы не видеть теги)
export function htmlToPlain(html: string) {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>\s*<p>/gi, '\n\n')
        .replace(/<\/?[^>]+>/g, '')
        .trim()
}

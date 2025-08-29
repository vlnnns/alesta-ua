export function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9\-а-яёґєії]+/gi, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export async function POST(req: Request) {
    try {
        const form = await req.formData()
        const file = form.get('image') as File | null
        if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

        if (!ALLOWED.has(file.type)) {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'File too large' }, { status: 413 })
        }

        const publicUploads = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(publicUploads, { recursive: true })

        const ext =
            file.type === 'image/jpeg' ? 'jpg'
                : file.type === 'image/png' ? 'png'
                    : file.type === 'image/webp' ? 'webp'
                        : file.type === 'image/avif' ? 'avif'
                            : 'bin'

        const name = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`
        const fp = path.join(publicUploads, name)

        const ab = await file.arrayBuffer()
        await fs.writeFile(fp, Buffer.from(ab), { mode: 0o644 })

        const relPath = `/uploads/${name}`

        // получаем абсолютный URL из запроса
        const { origin } = new URL(req.url)
        const absUrl = new URL(relPath, origin).toString()

        // возвращаем оба
        return NextResponse.json({ url: absUrl, path: relPath })
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Upload error' },
            { status: 500 },
        )
    }
}

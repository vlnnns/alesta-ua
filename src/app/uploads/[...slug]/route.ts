import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function contentType(ext: string) {
    switch (ext) {
        case '.png': return 'image/png'
        case '.jpg':
        case '.jpeg': return 'image/jpeg'
        case '.webp': return 'image/webp'
        case '.gif': return 'image/gif'
        default: return 'application/octet-stream'
    }
}

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ slug: string[] }> }   // <-- params як Promise
) {
    try {
        const { slug } = await ctx.params             // <-- обов’язково await
        const root = path.resolve(path.join(process.cwd(), 'uploads'))
        const resolved = path.resolve(path.join(root, ...slug))

        // захист від виходу за межі каталогу
        if (!resolved.startsWith(root + path.sep)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const buf = await fs.readFile(resolved)       // Buffer
        const bytes = new Uint8Array(buf)             // BodyInit = BufferSource
        const ext = path.extname(resolved).toLowerCase()

        return new NextResponse(bytes, {
            headers: {
                'Content-Type': contentType(ext),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
}

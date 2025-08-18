// src/lib/auth.ts
function toHex(buf: ArrayBuffer) {
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function hmac(input: string, secret: string) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(input));
    return toHex(sig);
}

function timingSafeEqualHex(a: string, b: string) {
    if (a.length !== b.length) return false;
    let ok = 1;
    for (let i = 0; i < a.length; i++) ok &= +(a.charCodeAt(i) === b.charCodeAt(i));
    return !!ok;
}

export async function signToken(sub: string, exp: number, secret: string) {
    const payload = `${sub}.${exp}`;
    const sig = await hmac(payload, secret);
    return `${payload}.${sig}`;
}

export async function verifyToken(token: string | undefined, secret: string) {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [sub, expStr, sig] = parts;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() / 1000 > exp) return false;
    const expected = await hmac(`${sub}.${expStr}`, secret);
    return timingSafeEqualHex(expected, sig);
}

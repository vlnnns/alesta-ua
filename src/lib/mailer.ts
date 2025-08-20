import nodemailer from 'nodemailer'

const {
    SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_BCC,
} = process.env

export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: String(SMTP_SECURE ?? 'true') === 'true', // 465=true, 587=false
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
})

export async function sendMail({
                                   to, subject, html, text,
                               }: { to: string; subject: string; html: string; text?: string }) {
    await transporter.sendMail({
        from: MAIL_FROM ?? 'no-reply@example.com',
        to,
        bcc: process.env.MAIL_BCC || undefined, // копия себе
        subject,
        html,
        text,
    })
}

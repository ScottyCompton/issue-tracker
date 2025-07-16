import WelcomeTemplate from "@/emails/WelcomeTemplate"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
    await resend.emails.send({
        from: 'kern@kernbusinessautomation.com',
        to: 'scott.lonis@outlook.com',
        subject: 'Hello World',
        react: WelcomeTemplate({ name: 'Scott' })
    })

    return NextResponse.json({ message: 'Email sent' })
}
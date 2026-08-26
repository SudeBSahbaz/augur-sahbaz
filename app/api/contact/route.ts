import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Zorunlu alanlar eksik." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Website <onboarding@resend.dev>",
      to: "ugursahbaz05@yahoo.com",
      replyTo: email,
      subject: `Web Sitesi Mesajı - ${name}`,
      html: `
        <h2>Yeni Web Sitesi Mesajı</h2>

        <p><strong>Ad Soyad:</strong> ${name}</p>

        <p><strong>E-posta:</strong> ${email}</p>

        <p><strong>Firma:</strong> ${company || "Belirtilmedi"}</p>

        <p><strong>Mesaj:</strong></p>

        <p>${message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Mesaj gönderilemedi." },
      { status: 500 }
    );
  }
}
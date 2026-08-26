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

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY tanımlı değil.");

      return NextResponse.json(
        { error: "E-posta servisi yapılandırılmamış." },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Website <onboarding@resend.dev>",
      to: ["ugursahbaz05@yahoo.com"],
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

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          error:
            error.message ||
            "E-posta gönderimi sırasında bir hata oluştu.",
        },
        { status: 500 }
      );
    }

    if (!data?.id) {
      console.error("Resend response içinde email ID yok:", data);

      return NextResponse.json(
        { error: "E-posta gönderimi doğrulanamadı." },
        { status: 500 }
      );
    }

    console.log("Mail Resend tarafından kabul edildi:", data.id);

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { error: "Mesaj gönderilemedi." },
      { status: 500 }
    );
  }
}
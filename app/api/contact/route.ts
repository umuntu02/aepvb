import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Initialize Resend only if API key is available
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide" },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    const resend = getResend();
    if (!resend) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Service d'email non configuré. Veuillez contacter l'administrateur." },
        { status: 503 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "A.E.P.V.B Contact <noreply@aepvb.org>", // Replace with your verified domain
      to: ["info@aepvb.org"],
      replyTo: email,
      subject: `[Contact A.E.P.V.B] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #1f2937;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px; white-space: pre-wrap;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Ce message a été envoyé depuis le formulaire de contact du site web A.E.P.V.B.
          </p>
        </div>
      `,
      text: `
Nouveau message de contact A.E.P.V.B

Nom: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}

---
Ce message a été envoyé depuis le formulaire de contact du site web A.E.P.V.B.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email. Veuillez réessayer." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email envoyé avec succès", id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

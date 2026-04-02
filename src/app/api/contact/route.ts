import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

// Simple in-memory rate limiter: 3 submissions per IP per 10 minutes
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message, website } = body as Record<string, string>;

    // Honeypot: bots fill the hidden "website" field, humans leave it empty
    if (website) {
      return NextResponse.json({ success: true }); // silently discard
    }

    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const raw = await getSettings();
    const s = { ...DEFAULT_SETTINGS, ...raw };

    const host = s.smtpHost;
    const port = parseInt(s.smtpPort || "587", 10);
    const user = s.smtpUser;
    const pass = s.smtpPass;
    const from = s.smtpFrom || user;
    const to = s.formEmail || s.email;

    if (!host || !user || !pass || !to) {
      return NextResponse.json(
        { error: "SMTP is not configured. Please set SMTP settings in the dashboard." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#c9a84c;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;font-weight:bold;width:120px;">Name</td><td style="padding:8px;">${name}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;white-space:pre-wrap;">${message}</td></tr>
          </table>
        </div>
      `,
    });

    // Auto-reply to the user
    await transporter.sendMail({
      from,
      to: `${name} <${email}>`,
      subject: `Thank you for contacting Dr. Firas Zoghieb`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;padding:40px 32px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:32px;">
            <p style="color:#c9a84c;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Dr. Firas Zoghieb</p>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Thank You, ${name}!</h1>
          </div>

          <div style="background:#161616;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px;">
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 12px;">
              Thank you for reaching out to Dr. Firas Zoghieb's clinic. We have received your message and our team will be in touch with you as soon as possible.
            </p>
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0;">
              We typically respond within <strong style="color:#c9a84c;">24 hours</strong>. If your enquiry is urgent, feel free to contact us directly on WhatsApp.
            </p>
          </div>

          <div style="text-align:center;margin-bottom:32px;">
            <a href="https://wa.me/971508696919" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:100px;">
              💬 Chat on WhatsApp
            </a>
          </div>

          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 24px;" />

          <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin:0;">
            Dr. Firas Zoghieb · Cosmetic Dentist Dubai<br/>
            Happiness St, Al Wasl, Dubai
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}

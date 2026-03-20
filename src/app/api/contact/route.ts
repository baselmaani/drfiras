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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}

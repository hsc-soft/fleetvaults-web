import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  emptyContactValues,
  validateContact,
  type ContactValues,
} from "@/lib/contact-schema";

const TO = process.env.CONTACT_TO ?? "info@fleetvaults.com";
// Must be a domain verified in Resend. `onboarding@resend.dev` works immediately
// for testing but can only deliver to the Resend account owner's address.
const FROM = process.env.CONTACT_FROM ?? "Fleet Vaults <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const values: ContactValues = { ...emptyContactValues };
  for (const key of Object.keys(emptyContactValues) as (keyof ContactValues)[]) {
    const value = (body as Record<string, unknown>)?.[key];
    values[key] = typeof value === "string" ? value : "";
  }

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Don't lose the lead just because email isn't configured yet.
    console.error("[contact] RESEND_API_KEY is not set — lead not emailed:", values);
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const rows: [string, string][] = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone],
    ["Vehicles", values.fleetSize],
    ["Message", values.message],
  ];

  const html = `
    <h2>New demo request — Fleet Vaults</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="color:#6b7280"><strong>${label}</strong></td><td>${escapeHtml(
              value,
            ).replace(/\n/g, "<br>")}</td></tr>`,
        )
        .join("")}
    </table>
  `;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: values.email,
      subject: `Demo request from ${values.name}`,
      html,
      text,
    });

    if (error) {
      console.error("[contact] Resend error:", JSON.stringify(error), error?.message);
      return NextResponse.json({ error: "Could not send message." }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Resend threw:", err);
    return NextResponse.json({ error: "Could not send message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

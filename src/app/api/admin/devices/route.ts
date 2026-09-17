import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { createDevice, deviceInputFromBody } from "@/lib/firebase-rtdb";

async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = await verifySessionToken(token, process.env.ADMIN_SESSION_SECRET ?? "");
  return Boolean(session);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!String(body?.deviceIMEI ?? "").trim()) {
    return NextResponse.json({ error: "Device IMEI is required." }, { status: 422 });
  }

  try {
    const id = await createDevice(await deviceInputFromBody(body));
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[admin] createDevice failed:", err);
    return NextResponse.json({ error: "Could not save device." }, { status: 502 });
  }
}

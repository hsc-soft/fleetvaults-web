import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_TTL_MS, createSessionToken } from "@/lib/admin-auth";
import { checkAdminCredentials } from "@/lib/firebase-rtdb";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = String((body as Record<string, unknown>)?.username ?? "").trim();
  const password = String((body as Record<string, unknown>)?.password ?? "");

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.error("[admin] ADMIN_SESSION_SECRET is not set");
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
  }

  let result;
  try {
    result = await checkAdminCredentials(username, password);
  } catch (err) {
    console.error("[admin] Firebase read failed:", err);
    return NextResponse.json({ error: "Could not reach the user database." }, { status: 502 });
  }

  if (result.status === "invalid") {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }
  if (result.status === "forbidden") {
    return NextResponse.json(
      { error: "This account does not have admin access." },
      { status: 403 },
    );
  }

  const token = await createSessionToken(username, secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return response;
}

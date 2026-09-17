import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { deleteDevice, deviceInputFromBody, updateDevice } from "@/lib/firebase-rtdb";

async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = await verifySessionToken(token, process.env.ADMIN_SESSION_SECRET ?? "");
  return Boolean(session);
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

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
    await updateDevice(id, await deviceInputFromBody(body));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] updateDevice failed:", err);
    return NextResponse.json({ error: "Could not update device." }, { status: 502 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteDevice(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] deleteDevice failed:", err);
    return NextResponse.json({ error: "Could not delete device." }, { status: 502 });
  }
}

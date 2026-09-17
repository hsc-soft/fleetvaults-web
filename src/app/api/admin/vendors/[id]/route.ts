import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { deleteVendor, updateVendor, type VendorInput } from "@/lib/firebase-rtdb";

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

  const str = (key: string) => String(body?.[key] ?? "").trim();

  const firmName = str("firmName");
  if (!firmName) {
    return NextResponse.json({ error: "Firm name is required." }, { status: 422 });
  }

  const mobileRaw = str("mobile");
  const vendor: VendorInput = {
    firmName,
    contactPerson: str("contactPerson"),
    mobile: /^\d+$/.test(mobileRaw) ? Number(mobileRaw) : mobileRaw,
    email: str("email"),
    address: str("address"),
    city: str("city"),
    state: str("state"),
    pinCode: str("pinCode"),
    gstNumber: str("gstNumber"),
    status: str("status") || "active",
  };

  try {
    await updateVendor(id, vendor);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] updateVendor failed:", err);
    return NextResponse.json({ error: "Could not update vendor." }, { status: 502 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteVendor(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] deleteVendor failed:", err);
    return NextResponse.json({ error: "Could not delete vendor." }, { status: 502 });
  }
}

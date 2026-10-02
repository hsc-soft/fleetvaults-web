import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import {
  deleteInvoice,
  findInvoiceByNumber,
  invoiceInputFromBody,
  updateInvoice,
} from "@/lib/firebase-rtdb";

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

  const invoice = invoiceInputFromBody(body);

  if (!invoice.invoiceNo) {
    return NextResponse.json({ error: "Invoice number is required." }, { status: 422 });
  }
  if (!invoice.billName) {
    return NextResponse.json({ error: "Customer name is required." }, { status: 422 });
  }
  if (invoice.items.length === 0) {
    return NextResponse.json({ error: "Add at least one item." }, { status: 422 });
  }

  try {
    // Keeping its own number is fine; taking another invoice's is not.
    if (await findInvoiceByNumber(invoice.invoiceNo, id)) {
      return NextResponse.json(
        { error: `Invoice number ${invoice.invoiceNo} is already used.` },
        { status: 409 },
      );
    }

    await updateInvoice(id, invoice);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] updateInvoice failed:", err);
    return NextResponse.json({ error: "Could not update invoice." }, { status: 502 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteInvoice(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] deleteInvoice failed:", err);
    return NextResponse.json({ error: "Could not delete invoice." }, { status: 502 });
  }
}

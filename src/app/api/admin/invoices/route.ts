import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import {
  createInvoice,
  findInvoiceByNumber,
  invoiceInputFromBody,
} from "@/lib/firebase-rtdb";

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
    // An invoice number is a legal identifier — never let two bills share one.
    if (await findInvoiceByNumber(invoice.invoiceNo)) {
      return NextResponse.json(
        { error: `Invoice number ${invoice.invoiceNo} is already used.` },
        { status: 409 },
      );
    }

    const id = await createInvoice(invoice);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[admin] createInvoice failed:", err);
    return NextResponse.json({ error: "Could not save invoice." }, { status: 502 });
  }
}

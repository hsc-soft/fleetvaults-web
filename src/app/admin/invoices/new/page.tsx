import Link from "next/link";
import { nextInvoiceNumber } from "@/lib/firebase-rtdb";
import { todayInIndia } from "@/lib/invoice";
import InvoiceForm from "../InvoiceForm";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  let suggestedNo = "";
  try {
    suggestedNo = await nextInvoiceNumber();
  } catch {
    // Offline or misconfigured DB — let the user type a number instead.
  }

  return (
    <div>
      <Link href="/admin/invoices" className="text-sm text-body hover:text-ink">
        ← Back to invoices
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">New invoice</h1>
      <p className="mt-1 text-sm text-body">
        Totals, GST split and the amount in words are calculated for you.
      </p>

      <InvoiceForm
        suggestedNo={suggestedNo}
        today={todayInIndia()}
        due={todayInIndia(7)}
      />
    </div>
  );
}

import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/firebase-rtdb";
import InvoiceDocument from "../InvoiceDocument";
import PrintButton from "../PrintButton";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// Shared between the metadata pass and the render so the invoice is read once.
const loadInvoice = cache(getInvoice);

/** The tab title doubles as the default filename for "Save as PDF". */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const invoice = await loadInvoice(id);
  return {
    title: { absolute: invoice?.invoiceNo ? `Invoice ${invoice.invoiceNo}` : "Invoice" },
  };
}

export default async function InvoicePage({ params }: Params) {
  const { id } = await params;
  const invoice = await loadInvoice(id);
  if (!invoice) notFound();

  return (
    <div>
      {/* Screen-only toolbar — `no-print` drops it from the printed page. */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/invoices" className="text-sm text-body hover:text-ink">
            ← Back to invoices
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
            {invoice.invoiceNo || `Invoice #${id}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/invoices/${id}/edit`}
            className="inline-flex items-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-body hover:border-signal-500 hover:text-accent"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm print:mt-0 print:rounded-none print:border-0 print:shadow-none">
        <InvoiceDocument invoice={invoice} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/firebase-rtdb";
import InvoiceForm from "../../InvoiceForm";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  return (
    <div>
      <Link href={`/admin/invoices/${id}`} className="text-sm text-body hover:text-ink">
        ← Back to invoice
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Edit {invoice.invoiceNo || `invoice #${id}`}
      </h1>

      <InvoiceForm initial={invoice} />
    </div>
  );
}

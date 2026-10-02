import Link from "next/link";
import { getInvoices } from "@/lib/firebase-rtdb";
import { calcInvoice, formatDate, money } from "@/lib/invoice";
import RowActions from "../RowActions";

// Always fetch fresh from Firebase.
export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-amber-100 text-amber-700",
  partial: "bg-blue-100 text-blue-700",
  draft: "bg-slate-200 text-slate-600",
};

export default async function AdminInvoicesPage() {
  let invoices: Awaited<ReturnType<typeof getInvoices>> = [];
  let error = false;
  try {
    invoices = await getInvoices();
  } catch {
    error = true;
  }

  const rows = invoices.map((invoice) => ({ invoice, totals: calcInvoice(invoice) }));
  const billed = rows.reduce((sum, row) => sum + row.totals.total, 0);
  const outstanding = rows.reduce((sum, row) => sum + row.totals.balance, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Invoices</h1>
      <p className="mt-1 text-sm text-body">
        {error
          ? "Could not load invoices from the database."
          : `${invoices.length} ${invoices.length === 1 ? "invoice" : "invoices"} raised.`}
      </p>

      {!error && invoices.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm font-medium text-body">Total billed</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-ink">
                ₹ {money(billed)}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm font-medium text-body">Outstanding</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-ink">
                ₹ {money(outstanding)}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm font-medium text-body">Invoices</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-ink">
                {invoices.length.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="border-b border-line bg-subtle/60 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Invoice No.</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Due</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                    <th className="px-5 py-3 text-right font-semibold">Balance</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map(({ invoice, totals }) => {
                    const status = (invoice.status ?? "").toLowerCase();
                    return (
                      <tr key={invoice.id} className="hover:bg-subtle/40">
                        <td className="px-5 py-3.5 font-medium text-ink">
                          <Link
                            href={`/admin/invoices/${invoice.id}`}
                            className="hover:text-accent"
                          >
                            {invoice.invoiceNo || `#${invoice.id}`}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-body">{invoice.billName || "—"}</td>
                        <td className="px-5 py-3.5 text-body">
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className="px-5 py-3.5 text-body">{formatDate(invoice.dueDate)}</td>
                        <td className="px-5 py-3.5 text-right font-medium text-ink">
                          ₹ {money(totals.total)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-body">
                          ₹ {money(totals.balance)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                              statusStyle[status] ?? "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {invoice.status ?? "unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <RowActions
                            editHref={`/admin/invoices/${invoice.id}/edit`}
                            deleteUrl={`/api/admin/invoices/${invoice.id}`}
                            name={invoice.invoiceNo || `invoice #${invoice.id}`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!error && invoices.length === 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">
          No invoices yet. Use the + button to raise the first one.
        </div>
      )}

      {/* New-invoice floating action button */}
      <Link
        href="/admin/invoices/new"
        aria-label="New invoice"
        title="New invoice"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-signal-600 text-white shadow-lg shadow-signal-600/30 transition-colors hover:bg-navy-800"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </div>
  );
}

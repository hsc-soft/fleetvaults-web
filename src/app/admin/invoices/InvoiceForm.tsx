"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import {
  SELLER,
  calcInvoice,
  emptyItem,
  money,
  type Invoice,
  type InvoiceInput,
  type InvoiceItem,
} from "@/lib/invoice";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const TAX_RATES = [0, 5, 12, 18, 28];

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none";

const cellClass =
  "w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none";

const labelClass = "block text-sm font-medium text-body";

/** Rows carry a stable key so removing one doesn't shuffle the inputs below it.
    `uid` never reaches the database — the API rebuilds items field by field. */
type Row = InvoiceItem & { uid: string };

let rowCounter = 0;
const newRow = (): Row => ({ ...emptyItem(), uid: `row-${++rowCounter}` });

type FormState = Omit<InvoiceInput, "items"> & { items: Row[] };

function blankInvoice(invoiceNo: string, today: string, due: string): FormState {
  return {
    invoiceNo,
    invoiceDate: today,
    dueDate: due,
    billName: "",
    billAddress: "",
    billGstin: "",
    billMobile: "",
    placeOfSupply: SELLER.state,
    shipSame: true,
    shipName: "",
    shipAddress: "",
    items: [newRow()],
    discount: 0,
    receivedAmount: 0,
    notes: "",
    status: "unpaid",
    createdAt: "",
  };
}

/** Text-backed numeric field — lets you clear it without the value snapping to 0. */
function NumberInput({
  value,
  onChange,
  className = cellClass,
  placeholder,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  // The parent only ever learns this value from this input, and stable row keys
  // keep a removed row from handing its text to its neighbour — so no re-sync.
  const [text, setText] = useState(() => (value ? String(value) : ""));

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={text}
      onChange={(event) => {
        const next = event.target.value;
        if (next !== "" && !/^\d*\.?\d{0,2}$/.test(next)) return;
        setText(next);
        onChange(next === "" ? 0 : Number(next));
      }}
      className={`${className} text-right`}
    />
  );
}

export default function InvoiceForm({
  initial,
  suggestedNo = "",
  today = "",
  due = "",
}: {
  initial?: Invoice;
  suggestedNo?: string;
  /** Defaults for a new invoice, resolved server-side in IST. */
  today?: string;
  due?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          ...initial,
          items: (initial.items.length ? initial.items : [emptyItem()]).map((item) => ({
            ...item,
            uid: `row-${++rowCounter}`,
          })),
        }
      : blankInvoice(suggestedNo, today, due),
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totals = calcInvoice(form);

  function set<K extends keyof InvoiceInput>(key: K, value: InvoiceInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateItem(index: number, patch: Partial<InvoiceItem>) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function addItem() {
    setForm((current) => ({ ...current, items: [...current.items, newRow()] }));
  }

  function removeItem(index: number) {
    setForm((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? [newRow()]
          : current.items.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.items.some((item) => item.name.trim())) {
      setError("Add at least one item with a name.");
      return;
    }

    setSubmitting(true);
    const url = isEdit ? `/api/admin/invoices/${initial!.id}` : "/api/admin/invoices";

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: form.items.map((item): InvoiceItem => ({
            name: item.name,
            hsn: item.hsn,
            qty: item.qty,
            unit: item.unit,
            rate: item.rate,
            taxRate: item.taxRate,
          })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not save invoice.");
        setSubmitting(false);
        return;
      }
      router.push(`/admin/invoices/${isEdit ? initial!.id : data.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Invoice details */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Invoice details
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="invoiceNo" className={labelClass}>
              Invoice number<span className="text-red-500"> *</span>
            </label>
            <input
              id="invoiceNo"
              required
              value={form.invoiceNo}
              onChange={(e) => set("invoiceNo", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="invoiceDate" className={labelClass}>
              Invoice date
            </label>
            <input
              id="invoiceDate"
              type="date"
              value={form.invoiceDate}
              onChange={(e) => set("invoiceDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="dueDate" className={labelClass}>
              Due date
            </label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="placeOfSupply" className={labelClass}>
              Place of supply
            </label>
            <select
              id="placeOfSupply"
              value={form.placeOfSupply}
              onChange={(e) => set("placeOfSupply", e.target.value)}
              className={inputClass}
            >
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted">
              {totals.intraState
                ? `Same state as ${SELLER.state} — CGST + SGST`
                : "Other state — IGST"}
            </p>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as InvoiceInput["status"])}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partially paid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </section>

      {/* Customer */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Bill to
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="billName" className={labelClass}>
              Customer name<span className="text-red-500"> *</span>
            </label>
            <input
              id="billName"
              required
              value={form.billName}
              onChange={(e) => set("billName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="billAddress" className={labelClass}>
              Address
            </label>
            <textarea
              id="billAddress"
              rows={2}
              value={form.billAddress}
              onChange={(e) => set("billAddress", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="billGstin" className={labelClass}>
              GSTIN
            </label>
            <input
              id="billGstin"
              value={form.billGstin}
              onChange={(e) => set("billGstin", e.target.value.toUpperCase())}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="billMobile" className={labelClass}>
              Mobile
            </label>
            <input
              id="billMobile"
              type="tel"
              value={form.billMobile}
              onChange={(e) => set("billMobile", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <label className="flex items-center gap-2.5 text-sm font-medium text-body">
            <input
              type="checkbox"
              checked={form.shipSame}
              onChange={(e) => set("shipSame", e.target.checked)}
              className="h-4 w-4 rounded border-line accent-signal-600"
            />
            Ship to the same address
          </label>

          {!form.shipSame && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="shipName" className={labelClass}>
                  Ship to name
                </label>
                <input
                  id="shipName"
                  value={form.shipName}
                  onChange={(e) => set("shipName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="shipAddress" className={labelClass}>
                  Ship to address
                </label>
                <textarea
                  id="shipAddress"
                  rows={2}
                  value={form.shipAddress}
                  onChange={(e) => set("shipAddress", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Items</h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-2 pr-3 font-semibold">Item</th>
                <th className="pb-2 pr-3 font-semibold">HSN</th>
                <th className="w-20 pb-2 pr-3 text-right font-semibold">Qty</th>
                <th className="w-24 pb-2 pr-3 font-semibold">Unit</th>
                <th className="w-32 pb-2 pr-3 text-right font-semibold">Rate</th>
                <th className="w-24 pb-2 pr-3 text-right font-semibold">Tax %</th>
                <th className="w-32 pb-2 pr-3 text-right font-semibold">Amount</th>
                <th className="w-10 pb-2" />
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, index) => (
                <tr key={item.uid} className="align-top">
                  <td className="py-1.5 pr-3">
                    <input
                      aria-label={`Item ${index + 1} name`}
                      placeholder="Amaron batt din 52 R 12V"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      className={cellClass}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <input
                      aria-label={`Item ${index + 1} HSN`}
                      placeholder="85071000"
                      value={item.hsn}
                      onChange={(e) => updateItem(index, { hsn: e.target.value })}
                      className={cellClass}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <NumberInput
                      ariaLabel={`Item ${index + 1} quantity`}
                      value={item.qty}
                      onChange={(qty) => updateItem(index, { qty })}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <input
                      aria-label={`Item ${index + 1} unit`}
                      value={item.unit}
                      onChange={(e) => updateItem(index, { unit: e.target.value })}
                      className={cellClass}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <NumberInput
                      ariaLabel={`Item ${index + 1} rate`}
                      value={item.rate}
                      onChange={(rate) => updateItem(index, { rate })}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <select
                      aria-label={`Item ${index + 1} tax rate`}
                      value={item.taxRate}
                      onChange={(e) => updateItem(index, { taxRate: Number(e.target.value) })}
                      className={cellClass}
                    >
                      {TAX_RATES.map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}%
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1.5 pr-3 pt-4 text-right text-sm font-medium text-ink">
                    ₹ {money(totals.items[index]?.amount ?? 0)}
                  </td>
                  <td className="py-1.5 pt-3">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove item ${index + 1}`}
                      title="Remove item"
                      className="rounded-lg p-2 text-body transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-body transition-colors hover:border-signal-500 hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add item
        </button>
      </section>

      {/* Totals */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label htmlFor="discount" className={labelClass}>
                Discount (₹)
              </label>
              <NumberInput
                ariaLabel="Discount"
                value={form.discount}
                onChange={(discount) => set("discount", discount)}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-muted">
                Deducted after tax, as the printed format shows it.
              </p>
            </div>
            <div>
              <label htmlFor="receivedAmount" className={labelClass}>
                Received amount (₹)
              </label>
              <NumberInput
                ariaLabel="Received amount"
                value={form.receivedAmount}
                onChange={(receivedAmount) => set("receivedAmount", receivedAmount)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <dl className="h-fit space-y-2.5 rounded-xl bg-subtle/60 p-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-body">Taxable value</dt>
              <dd className="font-medium text-ink">₹ {money(totals.taxable)}</dd>
            </div>
            {totals.hsnRows.map((row) => (
              <div
                key={`${row.hsn}-${row.taxRate}`}
                className="flex justify-between text-xs text-muted"
              >
                <dt>
                  {totals.intraState
                    ? `CGST + SGST @ ${money(row.splitRate)}% × 2`
                    : `IGST @ ${money(row.taxRate)}%`}
                  {row.hsn !== "—" && ` (${row.hsn})`}
                </dt>
                <dd>₹ {money(row.tax)}</dd>
              </div>
            ))}
            <div className="flex justify-between">
              <dt className="text-body">Total tax</dt>
              <dd className="font-medium text-ink">₹ {money(totals.tax)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-body">Discount</dt>
                <dd className="font-medium text-red-600">− ₹ {money(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2.5 text-base">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-bold text-ink">₹ {money(totals.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body">Received</dt>
              <dd className="font-medium text-ink">₹ {money(totals.received)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body">Balance due</dt>
              <dd className="font-semibold text-accent">₹ {money(totals.balance)}</dd>
            </div>
          </dl>
        </div>

        {error && (
          <p role="alert" className="mt-5 text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-7 flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Update invoice" : "Save invoice"}
          </Button>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-body hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </section>
    </form>
  );
}

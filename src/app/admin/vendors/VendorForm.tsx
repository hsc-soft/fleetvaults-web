"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import type { Vendor } from "@/lib/firebase-rtdb";

type Field = { name: keyof Vendor; label: string; type?: string; required?: boolean; full?: boolean };

const fields: Field[] = [
  { name: "firmName", label: "Firm name", required: true, full: true },
  { name: "contactPerson", label: "Contact person" },
  { name: "mobile", label: "Mobile", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "gstNumber", label: "GST number" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "pinCode", label: "Pincode" },
  { name: "address", label: "Address", full: true },
];

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none";

export default function VendorForm({ initial }: { initial?: Vendor }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const url = isEdit ? `/api/admin/vendors/${initial!.id}` : "/api/admin/vendors";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not save vendor.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/vendors");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
            <label htmlFor={field.name} className="block text-sm font-medium text-body">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              defaultValue={initial?.[field.name] ?? ""}
              className={inputClass}
            />
          </div>
        ))}

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-body">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "active"}
            className={inputClass}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-7 flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Update vendor" : "Save vendor"}
        </Button>
        <Link
          href="/admin/vendors"
          className="inline-flex items-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-body hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

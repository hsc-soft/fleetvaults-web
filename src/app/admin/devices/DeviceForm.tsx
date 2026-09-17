"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import type { Device, IdName } from "@/lib/firebase-rtdb";

type Options = { vendors: IdName[]; types: IdName[]; models: IdName[] };

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none";

export default function DeviceForm({
  options,
  initial,
}: {
  options: Options;
  initial?: Device;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const url = isEdit ? `/api/admin/devices/${initial!.id}` : "/api/admin/devices";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not save device.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/devices");
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
        <div>
          <label htmlFor="deviceIMEI" className="block text-sm font-medium text-body">
            Device IMEI <span className="text-red-500">*</span>
          </label>
          <input
            id="deviceIMEI"
            name="deviceIMEI"
            required
            defaultValue={initial?.deviceIMEI ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-body">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "New"}
            className={inputClass}
          >
            <option value="New">New</option>
            <option value="Active">Active</option>
            <option value="In-Active">In-Active</option>
          </select>
        </div>

        <div>
          <label htmlFor="vendorId" className="block text-sm font-medium text-body">
            Vendor
          </label>
          <select
            id="vendorId"
            name="vendorId"
            defaultValue={initial?.vendorId ?? ""}
            className={inputClass}
          >
            <option value="">Select vendor</option>
            {options.vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typeId" className="block text-sm font-medium text-body">
            Type
          </label>
          <select
            id="typeId"
            name="typeId"
            defaultValue={initial?.typeId ?? ""}
            className={inputClass}
          >
            <option value="">Select type</option>
            {options.types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="modelId" className="block text-sm font-medium text-body">
            Model
          </label>
          <select
            id="modelId"
            name="modelId"
            defaultValue={initial?.modelId ?? ""}
            className={inputClass}
          >
            <option value="">Select model</option>
            {options.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="simNumber" className="block text-sm font-medium text-body">
            SIM Number
          </label>
          <input
            id="simNumber"
            name="simNumber"
            defaultValue={initial?.simNumber ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="MSISDN" className="block text-sm font-medium text-body">
            MSISDN
          </label>
          <input
            id="MSISDN"
            name="MSISDN"
            defaultValue={initial?.MSISDN ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-7 flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Update device" : "Save device"}
        </Button>
        <Link
          href="/admin/devices"
          className="inline-flex items-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-body hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

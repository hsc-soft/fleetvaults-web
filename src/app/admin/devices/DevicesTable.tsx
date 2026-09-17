"use client";

import { useMemo, useState } from "react";
import RowActions from "../RowActions";
import SearchableSelect from "../SearchableSelect";
import type { Device } from "@/lib/firebase-rtdb";

const statusStyle: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  "in-active": "bg-slate-200 text-slate-600",
  inactive: "bg-slate-200 text-slate-600",
  idle: "bg-amber-100 text-amber-700",
  offline: "bg-slate-200 text-slate-600",
};

export default function DevicesTable({ devices }: { devices: Device[] }) {
  const [query, setQuery] = useState("");
  const [vendor, setVendor] = useState("all");
  const [status, setStatus] = useState("all");

  const vendorOptions = useMemo(
    () =>
      Array.from(new Set(devices.map((d) => d.vendorName).filter(Boolean) as string[])).sort(),
    [devices],
  );
  const statusOptions = useMemo(
    () =>
      Array.from(new Set(devices.map((d) => d.status).filter(Boolean) as string[])).sort(),
    [devices],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devices.filter((d) => {
      const matchesImei = !q || String(d.deviceIMEI ?? "").toLowerCase().includes(q);
      const matchesVendor = vendor === "all" || d.vendorName === vendor;
      const matchesStatus = status === "all" || d.status === status;
      return matchesImei && matchesVendor && matchesStatus;
    });
  }, [devices, query, vendor, status]);

  const filtering = Boolean(query.trim()) || vendor !== "all" || status !== "all";

  const selectClass =
    "rounded-lg border border-line bg-white py-2.5 pl-3 pr-8 text-sm text-ink focus:border-signal-400 focus:outline-none";

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by IMEI…"
            aria-label="Search devices by IMEI"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none"
          />
        </div>

        <SearchableSelect
          value={vendor}
          onChange={setVendor}
          options={vendorOptions}
          allLabel="All vendors"
          placeholder="Search vendor…"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className={selectClass}
        >
          <option value="all">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <span className="text-sm text-muted">
          {filtering
            ? `${filtered.length} of ${devices.length}`
            : `${devices.length} ${devices.length === 1 ? "device" : "devices"}`}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-line bg-subtle/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">IMEI</th>
                  <th className="px-5 py-3 font-semibold">Model</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 font-semibold">SIM Number</th>
                  <th className="px-5 py-3 font-semibold">MSISDN</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((device, index) => {
                  const status = (device.status ?? "").toLowerCase();
                  return (
                    <tr key={device.id} className="hover:bg-subtle/40">
                      <td className="px-5 py-3.5 text-muted">{index + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-ink">
                        {device.deviceIMEI ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-body">{device.modelName ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{device.typeName ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{device.vendorName ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{device.simNumber ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{device.MSISDN ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            statusStyle[status] ?? "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {device.status ?? "unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <RowActions
                          editHref={`/admin/devices/${device.id}/edit`}
                          deleteUrl={`/api/admin/devices/${device.id}`}
                          name={String(device.deviceIMEI ?? "device")}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">
          {filtering ? "No devices match the current filters." : "No devices found yet."}
        </div>
      )}
    </>
  );
}

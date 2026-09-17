import Link from "next/link";
import { getVendors } from "@/lib/firebase-rtdb";
import RowActions from "../RowActions";

// Always fetch fresh from Firebase.
export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  inactive: "bg-slate-200 text-slate-600",
};

export default async function AdminVendorsPage() {
  let vendors: Awaited<ReturnType<typeof getVendors>> = [];
  let error = false;
  try {
    vendors = await getVendors();
  } catch {
    error = true;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Vendors</h1>
      <p className="mt-1 text-sm text-body">
        {error
          ? "Could not load vendors from the database."
          : `${vendors.length} ${vendors.length === 1 ? "vendor" : "vendors"} registered.`}
      </p>

      {!error && vendors.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1160px] text-left text-sm">
              <thead className="border-b border-line bg-subtle/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Firm</th>
                  <th className="px-5 py-3 font-semibold">Contact Person</th>
                  <th className="px-5 py-3 font-semibold">Mobile</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">State</th>
                  <th className="px-5 py-3 font-semibold">Pincode</th>
                  <th className="px-5 py-3 font-semibold">GST</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {vendors.map((vendor) => {
                  const status = (vendor.status ?? "").toLowerCase();
                  return (
                    <tr key={vendor.id} className="hover:bg-subtle/40">
                      <td className="px-5 py-3.5 font-medium text-ink">
                        {vendor.firmName ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-body">{vendor.contactPerson ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">
                        {vendor.mobile ? (
                          <a href={`tel:${vendor.mobile}`} className="hover:text-accent">
                            {vendor.mobile}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-body">
                        {vendor.email ? (
                          <a href={`mailto:${vendor.email}`} className="hover:text-accent">
                            {vendor.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-body">{vendor.city ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{vendor.state ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{vendor.pinCode ?? "—"}</td>
                      <td className="px-5 py-3.5 text-body">{vendor.gstNumber ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            statusStyle[status] ?? "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {vendor.status ?? "unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <RowActions
                          editHref={`/admin/vendors/${vendor.id}/edit`}
                          deleteUrl={`/api/admin/vendors/${vendor.id}`}
                          name={vendor.firmName ?? "vendor"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!error && vendors.length === 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">
          No vendors found yet.
        </div>
      )}

      {/* Add-vendor floating action button */}
      <Link
        href="/admin/vendors/new"
        aria-label="Add vendor"
        title="Add vendor"
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

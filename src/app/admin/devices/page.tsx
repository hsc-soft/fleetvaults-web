import Link from "next/link";
import { getDevices } from "@/lib/firebase-rtdb";
import DevicesTable from "./DevicesTable";

// Always fetch fresh from Firebase.
export const dynamic = "force-dynamic";

export default async function AdminDevicesPage() {
  let devices: Awaited<ReturnType<typeof getDevices>> = [];
  let error = false;
  try {
    devices = await getDevices();
  } catch {
    error = true;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Devices</h1>
      <p className="mt-1 text-sm text-body">Registered GPS devices.</p>

      {error ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">
          Could not load devices from the database.
        </div>
      ) : (
        <DevicesTable devices={devices} />
      )}

      {/* Add-device floating action button */}
      <Link
        href="/admin/devices/new"
        aria-label="Add device"
        title="Add device"
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

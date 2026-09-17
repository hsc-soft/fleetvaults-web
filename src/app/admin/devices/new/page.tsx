import Link from "next/link";
import { getDeviceOptions } from "@/lib/firebase-rtdb";
import DeviceForm from "../DeviceForm";

export const dynamic = "force-dynamic";

export default async function NewDevicePage() {
  const options = await getDeviceOptions();

  return (
    <div className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/admin/devices" className="hover:text-ink">
          Devices
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-body">Add device</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Add device</h1>

      <DeviceForm options={options} />
    </div>
  );
}

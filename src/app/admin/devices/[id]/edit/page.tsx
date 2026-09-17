import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevice, getDeviceOptions } from "@/lib/firebase-rtdb";
import DeviceForm from "../../DeviceForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditDevicePage({ params }: PageProps) {
  const { id } = await params;
  const [device, options] = await Promise.all([getDevice(id), getDeviceOptions()]);

  if (!device) notFound();

  return (
    <div className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/admin/devices" className="hover:text-ink">
          Devices
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-body">Edit device</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Edit {device.deviceIMEI ?? "device"}
      </h1>

      <DeviceForm options={options} initial={device} />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getVendor } from "@/lib/firebase-rtdb";
import VendorForm from "../../VendorForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditVendorPage({ params }: PageProps) {
  const { id } = await params;
  const vendor = await getVendor(id);

  if (!vendor) notFound();

  return (
    <div className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/admin/vendors" className="hover:text-ink">
          Vendors
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-body">Edit vendor</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        Edit {vendor.firmName ?? "vendor"}
      </h1>

      <VendorForm initial={vendor} />
    </div>
  );
}

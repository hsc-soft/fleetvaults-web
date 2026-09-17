import Link from "next/link";
import VendorForm from "../VendorForm";

export default function NewVendorPage() {
  return (
    <div className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/admin/vendors" className="hover:text-ink">
          Vendors
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-body">Add vendor</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Add vendor</h1>

      <VendorForm />
    </div>
  );
}

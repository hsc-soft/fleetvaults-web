import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({
  product,
  href,
}: {
  product: Product;
  href?: string;
}) {
  const inner = (
    <>
      {product.image && (
        <div className="relative aspect-[4/3] border-b border-line bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-semibold text-ink">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
          {product.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {product.highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-body"
            >
              {highlight}
            </li>
          ))}
        </ul>
        {href && (
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
            View details
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h11M11 5l5 5-5 5" />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  const base =
    "flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface";

  if (href) {
    return (
      <Link href={href} className={`group ${base} transition-colors hover:border-signal-500`}>
        {inner}
      </Link>
    );
  }

  return <div className={base}>{inner}</div>;
}

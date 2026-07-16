import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import ProductCarousel from "@/components/ProductCarousel";
import CallToAction from "@/components/sections/CallToAction";
import { productCategories, productHref } from "@/lib/products";

const PER_VIEW = 3;

export const metadata: Metadata = {
  title: "Products",
  description:
    "GPS trackers and accessories from Fleet Vaults — wired, magnetic, and wireless trackers, sensors, and installation accessories.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-signal-500/15 blur-3xl"
        />
        <Container className="relative py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Products
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Trackers and hardware for every vehicle
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            From hardwired fleet units to slap-on magnetic trackers and the sensors
            that make them smarter — pick the hardware, we handle the platform.
          </p>
        </Container>
      </section>

      {productCategories.map((category) => (
        <section key={category.slug} className="py-10 sm:py-14">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow={category.name}
                title={category.tagline}
                align="left"
              />
              <Link
                href={`/products/${category.slug}`}
                className="text-sm font-semibold text-accent hover:text-ink"
              >
                View all →
              </Link>
            </div>

            <div className="mt-8">
              {category.products.length > PER_VIEW ? (
                <ProductCarousel
                  products={category.products}
                  categorySlug={category.slug}
                />
              ) : (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.products.map((product) => (
                    <li key={product.name}>
                      <ProductCard
                        product={product}
                        href={productHref(category.slug, product.slug)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Container>
        </section>
      ))}

      <CallToAction />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import CallToAction from "@/components/sections/CallToAction";
import { getProduct, productCategories, productHref } from "@/lib/products";

type PageProps = { params: Promise<{ slug: string; product: string }> };

export function generateStaticParams() {
  return productCategories.flatMap((category) =>
    category.products.map((product) => ({
      slug: category.slug,
      product: product.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, product } = await params;
  const found = getProduct(slug, product);

  if (!found) return { title: "Product not found" };

  return {
    title: found.product.name,
    description: found.product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, product } = await params;
  const found = getProduct(slug, product);

  if (!found) notFound();

  const { category, product: item } = found;
  const related = category.products.filter((p) => p.slug !== item.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/products" className="hover:text-ink">
              Products
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href={`/products/${category.slug}`} className="hover:text-ink">
              {category.name}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-body">{item.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {item.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {category.name}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {item.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-body">
                {item.overview ?? item.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-body"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/contact">Enquire about {item.name}</ButtonLink>
                <ButtonLink href={`/products/${category.slug}`} variant="secondary">
                  Back to {category.name}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {item.features && item.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-ink">Features</h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm text-body">
                        <svg
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 10.5l4 4 8-9" />
                        </svg>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.useCases && item.useCases.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold tracking-tight text-ink">
                    Where it fits
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {item.useCases.map((useCase) => (
                      <li key={useCase} className="flex gap-3 text-sm text-body">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-500"
                        />
                        <span className="leading-relaxed">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {item.specs && item.specs.length > 0 && (
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h2 className="text-base font-semibold text-ink">Specifications</h2>
                  <dl className="mt-5 divide-y divide-line text-sm">
                    {item.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between gap-4 py-2.5"
                      >
                        <dt className="text-muted">{spec.label}</dt>
                        <dd className="text-right font-medium text-ink">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </aside>
            )}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line py-10 sm:py-14">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              More in {category.name}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} href={productHref(category.slug, p.slug)} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CallToAction />
    </>
  );
}

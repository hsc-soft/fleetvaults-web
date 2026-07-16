import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import CallToAction from "@/components/sections/CallToAction";
import { getProductCategory, productCategories, productHref } from "@/lib/products";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getProductCategory(slug);

  if (!category) return { title: "Product not found" };

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getProductCategory(slug);

  if (!category) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-signal-500/15 blur-3xl"
        />
        <Container className="relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/products" className="hover:text-ink">
              Products
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-body">{category.name}</span>
          </nav>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-accent">{category.tagline}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
            {category.description}
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {category.products.length}{" "}
            {category.products.length === 1 ? "product" : "products"}
          </h2>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => (
              <li key={product.name}>
                <ProductCard
                  product={product}
                  href={productHref(category.slug, product.slug)}
                />
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap gap-3">
            {productCategories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-body transition-colors hover:border-signal-500 hover:text-accent"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

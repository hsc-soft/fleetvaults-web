import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { solutions } from "@/lib/solutions";
import { productCategories } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2">
            <Logo size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
              GPS vehicle tracking for fleets, cars, trucks, and school buses.
              Track, monitor, and protect every vehicle you are responsible for.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink">Products</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-body hover:text-ink"
                >
                  All Products
                </Link>
              </li>
              {productCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products/${category.slug}`}
                    className="text-sm text-body hover:text-ink"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink">Solutions</h2>
            <ul className="mt-4 space-y-2.5">
              {solutions.map((solution) => (
                <li key={solution.slug}>
                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="text-sm text-body hover:text-ink"
                  >
                    {solution.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink">Company</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-body hover:text-ink">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-body hover:text-ink">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@fleetvaults.com"
                  className="text-sm text-body hover:text-ink"
                >
                  info@fleetvaults.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Fleet Vaults. Track • Monitor • Protect
        </div>
      </Container>
    </footer>
  );
}

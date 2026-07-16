"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { ButtonLink } from "./Button";
import NavDropdown, { type DropdownItem } from "./NavDropdown";
import { solutions } from "@/lib/solutions";
import { productCategories } from "@/lib/products";

const solutionItems: DropdownItem[] = solutions.map((s) => ({
  href: `/solutions/${s.slug}`,
  title: s.name,
  subtitle: s.tagline,
}));

const productItems: DropdownItem[] = [
  { href: "/products", title: "All Products", subtitle: "Browse the full catalog" },
  ...productCategories.map((c) => ({
    href: `/products/${c.slug}`,
    title: c.name,
    subtitle: c.tagline,
  })),
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function close() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="Fleet Vaults home">
          <Logo priority />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`text-sm font-medium transition-colors ${
              pathname === "/" ? "text-accent" : "text-body hover:text-ink"
            }`}
          >
            Home
          </Link>

          <NavDropdown label="Products" items={productItems} sectionPrefix="/products" />

          <NavDropdown
            label="Solutions"
            items={solutionItems}
            sectionPrefix="/solutions"
          />

          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className={`text-sm font-medium transition-colors ${
              pathname === "/about" ? "text-accent" : "text-body hover:text-ink"
            }`}
          >
            About
          </Link>

          <ButtonLink href="/contact" className="px-5 py-2">
            Book a demo
          </ButtonLink>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-body hover:text-ink lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </Container>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-surface lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            <MobileLink href="/" pathname={pathname} onClick={close}>
              Home
            </MobileLink>

            <MobileGroupLabel>Products</MobileGroupLabel>
            {productItems.map((item) => (
              <MobileLink
                key={item.href}
                href={item.href}
                pathname={pathname}
                onClick={close}
              >
                {item.title}
              </MobileLink>
            ))}

            <MobileGroupLabel>Solutions</MobileGroupLabel>
            {solutionItems.map((item) => (
              <MobileLink
                key={item.href}
                href={item.href}
                pathname={pathname}
                onClick={close}
              >
                {item.title}
              </MobileLink>
            ))}

            <div className="mt-3">
              <MobileLink href="/about" pathname={pathname} onClick={close}>
                About
              </MobileLink>
            </div>

            <ButtonLink href="/contact" className="mt-3" onClick={close}>
              Book a demo
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}

function MobileGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
      {children}
    </p>
  );
}

function MobileLink({
  href,
  pathname,
  onClick,
  children,
}: {
  href: string;
  pathname: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
        active
          ? "bg-subtle text-accent"
          : "text-body hover:bg-subtle hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

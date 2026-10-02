"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import LogoutButton from "./LogoutButton";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

const nav: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg {...iconProps}>
        <path d="M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-4H4z" />
      </svg>
    ),
  },
  {
    href: "/admin/devices",
    label: "Devices",
    icon: (
      <svg {...iconProps}>
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    href: "/admin/invoices",
    label: "Invoices",
    icon: (
      <svg {...iconProps}>
        <path d="M6 2h9l4 4v16l-3-2-3 2-3-2-3 2V2z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
    ),
  },
  {
    href: "/admin/vendors",
    label: "Vendors",
    icon: (
      <svg {...iconProps}>
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
        <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      </svg>
    ),
  },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The login page is bare — no sidebar/topbar.
  if (pathname === "/admin/login") return <>{children}</>;

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const navLinks = (onNavigate?: () => void) =>
    nav.map((item) => {
      const active = isActive(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active
              ? "bg-signal-500/10 text-accent"
              : "text-body hover:bg-subtle hover:text-ink"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      );
    });

  const sidebarInner = (onNavigate?: () => void) => (
    <>
      <div className="flex h-16 items-center border-b border-line px-5">
        <Logo size="sm" />
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-1 p-3">
        {navLinks(onNavigate)}
      </nav>
      <div className="space-y-3 border-t border-line p-4">
        <Link
          href="/"
          className="block text-sm text-body hover:text-ink"
          onClick={onNavigate}
        >
          View site ↗
        </Link>
        <LogoutButton />
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        {sidebarInner()}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface shadow-xl">
            {sidebarInner(() => setOpen(false))}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="no-print flex h-16 items-center gap-3 border-b border-line bg-surface px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
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
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-ink">Admin Panel</span>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0">{children}</div>
      </div>
    </div>
  );
}

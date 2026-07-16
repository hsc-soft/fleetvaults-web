"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

export type DropdownItem = {
  href: string;
  title: string;
  subtitle?: string;
};

/**
 * Desktop nav dropdown. Opens on hover (pointer devices) and on click/keyboard
 * (touch + a11y), and dismisses on outside click or Escape.
 */
export default function NavDropdown({
  label,
  items,
  sectionPrefix,
  width = "w-72",
  onNavigate,
}: {
  label: string;
  items: DropdownItem[];
  sectionPrefix: string;
  width?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const sectionActive = pathname.startsWith(sectionPrefix);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleNavigate() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          sectionActive ? "text-accent" : "text-body hover:text-ink"
        }`}
      >
        {label}
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>

      {open && (
        // The wrapper's padding bridges the gap under the button, so the
        // pointer never leaves the subtree on its way down to the menu.
        <div className="absolute left-0 top-full pt-3">
          <ul
            id={menuId}
            className={`${width} rounded-2xl border border-line bg-surface p-2 shadow-xl shadow-slate-300/40`}
          >
            {items.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2.5 transition-colors ${
                      active ? "bg-subtle" : "hover:bg-subtle"
                    }`}
                  >
                    <span
                      className={`block text-sm font-semibold ${
                        active ? "text-accent" : "text-ink"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="mt-0.5 block text-xs text-muted">
                        {item.subtitle}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

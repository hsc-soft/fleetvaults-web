"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchableSelect({
  value,
  onChange,
  options,
  allLabel = "All",
  placeholder = "Search…",
  className = "w-52",
}: {
  value: string; // "all" or a specific option
  onChange: (value: string) => void;
  options: string[];
  allLabel?: string;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  }, [options, query]);

  function select(next: string) {
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-white py-2.5 pl-3 pr-2 text-sm text-ink focus:border-signal-400 focus:outline-none"
      >
        <span className={value === "all" ? "text-muted" : "truncate"}>
          {value === "all" ? allLabel : value}
        </span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
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
        <div className="absolute z-30 mt-2 w-full rounded-lg border border-line bg-surface shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-signal-400 focus:outline-none"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-1 pt-0 text-sm">
            <li>
              <button
                type="button"
                onClick={() => select("all")}
                className="w-full rounded-md px-3 py-2 text-left text-body hover:bg-subtle"
              >
                {allLabel}
              </button>
            </li>
            {filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => select(option)}
                  className={`block w-full truncate rounded-md px-3 py-2 text-left hover:bg-subtle ${
                    option === value ? "font-semibold text-accent" : "text-ink"
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-muted">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

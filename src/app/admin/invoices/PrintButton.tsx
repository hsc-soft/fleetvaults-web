"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-signal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-signal-600/20 transition-colors hover:bg-navy-800"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9V3h12v6M6 18H4v-6h16v6h-2" />
        <path d="M6 14h12v7H6z" />
      </svg>
      Print / Save PDF
    </button>
  );
}

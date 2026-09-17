import { summary } from "@/lib/admin-data";

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

const stats = [
  {
    label: "Total Devices",
    value: summary.totalDevices,
    hint: "All registered GPS units",
    icon: (
      <svg {...iconProps}>
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    label: "Total Vendors",
    value: summary.totalVendors,
    hint: "Partners and resellers",
    icon: (
      <svg {...iconProps}>
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
      </svg>
    ),
  },
  {
    label: "Active Devices",
    value: summary.activeDevices,
    hint: "Reporting in the last 24h",
    icon: (
      <svg {...iconProps}>
        <path d="M4 12h4l2 6 4-14 2 8h4" />
      </svg>
    ),
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-body">Overview of your fleet network.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-body">{stat.label}</span>
              <span className="inline-flex rounded-xl bg-signal-500/10 p-2.5 text-accent">
                {stat.icon}
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold tracking-tight text-ink">
              {stat.value.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-muted">{stat.hint}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted">
        Figures are placeholders. Connect a data source to show live counts.
      </p>
    </div>
  );
}

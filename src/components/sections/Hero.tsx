import Container from "../Container";
import { ButtonLink } from "../Button";

const stats = [
  { value: "10s", label: "Live location refresh" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "24×7", label: "Monitoring support" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Signal glow echoing the logo's blue halo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-signal-500/12 blur-3xl"
      />

      <Container className="relative py-12 sm:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-x-[30px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-signal-500/30 bg-signal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Track • Monitor • Protect
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Every vehicle,
              <span className="block text-accent">on one live map.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">
              Fleet Vaults is GPS tracking that fleet managers actually use daily:
              real-time location, geofence alerts, fuel and driver reports, and
              theft protection for cars, trucks, and school buses.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/contact">Book a free demo</ButtonLink>
              <ButtonLink href="/solutions/fleet-tracking" variant="secondary">
                Explore solutions
              </ButtonLink>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold text-ink sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <LiveMapPreview />
        </div>
      </Container>
    </section>
  );
}

const vehicles = [
  { id: "RJ-12 AB 4471", type: "Truck", status: "Moving", speed: "62 km/h" },
  { id: "RJ-14 CD 9032", type: "Van", status: "Idle", speed: "0 km/h" },
  { id: "RJ-04 EF 1188", type: "Bus", status: "Moving", speed: "38 km/h" },
];

function LiveMapPreview() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-2xl shadow-slate-300/60 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Live fleet</p>
        <span className="inline-flex items-center gap-2 text-xs text-body">
          <span className="h-2 w-2 rounded-full bg-signal-400" aria-hidden="true" />
          3 vehicles online
        </span>
      </div>

      <div
        aria-hidden="true"
        className="mt-4 h-44 rounded-xl border border-line bg-[radial-gradient(circle_at_30%_35%,rgba(30,144,255,0.28),transparent_55%),linear-gradient(#0d1729,#16294b)]"
      >
        <svg viewBox="0 0 320 176" className="h-full w-full">
          <path
            d="M10 150 C 80 120, 90 60, 160 55 S 260 90, 310 30"
            fill="none"
            stroke="var(--color-signal-500)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <circle cx="160" cy="55" r="6" fill="var(--color-signal-400)" />
          <circle cx="60" cy="132" r="5" fill="var(--color-silver-400)" />
          <circle cx="288" cy="45" r="5" fill="var(--color-silver-400)" />
        </svg>
      </div>

      <ul className="mt-4 space-y-2">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            className="flex items-center justify-between rounded-lg bg-subtle px-3 py-2.5 text-sm"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">{vehicle.id}</span>
              <span className="text-xs text-muted">{vehicle.type}</span>
            </span>
            <span className="shrink-0 text-right">
              <span
                className={`block text-xs font-semibold ${
                  vehicle.status === "Moving" ? "text-accent" : "text-body"
                }`}
              >
                {vehicle.status}
              </span>
              <span className="text-xs text-muted">{vehicle.speed}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

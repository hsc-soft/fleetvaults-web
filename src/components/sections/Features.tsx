import Container from "../Container";
import SectionHeading from "../SectionHeading";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const iconClass = "h-6 w-6";
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: iconClass,
};

const features: Feature[] = [
  {
    title: "Real-time GPS tracking",
    description:
      "Location, speed, and heading for every vehicle, refreshed every 10 seconds on a single live map.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 21c4.5-6 7-9.3 7-12a7 7 0 1 0-14 0c0 2.7 2.5 6 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Geofence alerts",
    description:
      "Draw zones around depots and customer sites. Get notified the moment a vehicle enters or leaves.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 8v12h12" />
        <path d="M8 4h12v12" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Theft protection",
    description:
      "Unauthorised movement alerts, device-tamper detection, and remote engine immobilisation from the app.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" />
        <path d="M9.5 12l1.8 1.8L15 10" />
      </svg>
    ),
  },
  {
    title: "Fuel & idling reports",
    description:
      "See which vehicles burn fuel standing still, and how much that habit costs you every month.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 20V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14" />
        <path d="M3 20h13" />
        <path d="M14 10h3a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V9l-2.5-2.5" />
      </svg>
    ),
  },
  {
    title: "Driver behaviour scores",
    description:
      "Harsh braking, over-speeding, and night driving rolled into a score you can coach against.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    ),
  },
  {
    title: "Reports & API",
    description:
      "Scheduled email reports for your team, plus a REST API to push trip data into your own systems.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 19V5a1 1 0 0 1 1-1h9l6 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
        <path d="M14 4v6h6" />
        <path d="M8 14h6M8 17h4" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need to run a fleet"
          description="Not a pile of features nobody opens. These are the six screens your team will live in."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-signal-500/40"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex shrink-0 rounded-xl bg-signal-500/10 p-3 text-accent">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-body">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

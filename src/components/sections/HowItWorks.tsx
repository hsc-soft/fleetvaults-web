import Container from "../Container";
import SectionHeading from "../SectionHeading";

const steps = [
  {
    title: "Install the device",
    description:
      "Our technician fits a tamper-resistant GPS unit to each vehicle. Around 20 minutes per vehicle, at your yard.",
  },
  {
    title: "Vehicles come online",
    description:
      "Devices pair with your Fleet Vaults account automatically. Your live map is populated the same day.",
  },
  {
    title: "Set your rules",
    description:
      "Draw geofences, set speed limits, and pick who gets alerted for what — by vehicle, route, or driver.",
  },
  {
    title: "Track, monitor, protect",
    description:
      "Watch the fleet in real time, act on alerts as they land, and review the reports that show up in your inbox.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-subtle py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Live in a day, not a quarter"
          description="No IT project, no lengthy onboarding. Install, configure, and start tracking."
        />

        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-signal-500/40 bg-signal-500/10 text-sm font-bold text-accent">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-body">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CallToAction from "@/components/sections/CallToAction";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Fleet Vaults builds GPS vehicle tracking for fleet operators who need to know where every vehicle is, right now.",
};

const values = [
  {
    title: "Track",
    description:
      "Location data is only useful if it is current. We hold ourselves to a 10-second refresh, not a 5-minute one.",
  },
  {
    title: "Monitor",
    description:
      "Raw dots on a map do not change behaviour. Reports and scorecards do. We ship the analysis, not just the feed.",
  },
  {
    title: "Protect",
    description:
      "A tracker earns its place the day a vehicle goes missing. Tamper detection and immobilisation are standard, not add-ons.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-signal-500/15 blur-3xl"
        />
        <Container className="relative py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            About us
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            We build the tracking system we wished we had.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            Fleet Vaults started when a transporter lost a loaded truck and the
            tracker he was paying for showed a location four hours old. Everything
            we have built since is a reaction to that failure.
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="Track • Monitor • Protect"
            description="Three words on our logo, and the only three promises we make."
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <li
                key={value.title}
                className="rounded-2xl border border-line bg-surface p-7"
              >
                <h3 className="text-lg font-semibold text-accent">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {value.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

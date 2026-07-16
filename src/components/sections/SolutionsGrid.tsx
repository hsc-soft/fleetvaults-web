import Link from "next/link";
import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { solutions } from "@/lib/solutions";

export default function SolutionsGrid() {
  return (
    <section id="solutions" className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Solutions"
          title="Tuned to what you drive"
          description="The same platform, configured for the vehicles and the risks you actually deal with."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {solutions.map((solution) => (
            <li key={solution.slug}>
              <Link
                href={`/solutions/${solution.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-signal-500/40"
              >
                <h3 className="text-xl font-semibold text-ink">{solution.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent">
                  {solution.tagline}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-body">
                  {solution.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  Learn more
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h11M11 5l5 5-5 5" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

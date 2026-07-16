import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import CallToAction from "@/components/sections/CallToAction";
import { getSolution, solutions } from "@/lib/solutions";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) return { title: "Solution not found" };

  return {
    title: `${solution.name} — ${solution.tagline}`,
    description: solution.summary,
  };
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-signal-500/15 blur-3xl"
        />
        <Container className="relative py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {solution.name}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {solution.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            {solution.summary}
          </p>
          <p className="mt-8 inline-flex rounded-full border border-line bg-subtle px-4 py-2 text-sm text-body">
            Built for: {solution.audience}
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              What you get
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {solution.features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-line bg-surface p-6"
                >
                  <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-signal-500/25 bg-surface p-6 lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-base font-semibold text-ink">The outcome</h2>
            <ul className="mt-5 space-y-4">
              {solution.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-sm text-body">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  <span className="leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

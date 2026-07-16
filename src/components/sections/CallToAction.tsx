import Container from "../Container";
import { ButtonLink } from "../Button";

export default function CallToAction() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-signal-500/25 bg-navy-900 px-7 py-10 text-center sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-signal-500/25 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See your fleet on the map this week
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-silver-400">
              Book a 20-minute demo. We will show you the live map with a sample
              fleet, and quote for the number of vehicles you run.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/contact">Book a free demo</ButtonLink>
              <ButtonLink href="/about" variant="secondary">
                About Fleet Vaults
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free Fleet Vaults demo. Tell us how many vehicles you run and we will call you within one working day.",
};

const details = [
  { label: "Email", value: "info@fleetvaults.com", href: "mailto:info@fleetvaults.com" },
  { label: "Phone", value: "+91-9461587155", href: "tel:+919461587155" },
  { label: "Support", value: "24×7 monitoring desk" },
  {
    label: "Office",
    value: "A-80, Dadudayal Nagar, Mansarover, Jaipur 302020, Rajasthan",
  },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-signal-500/15 blur-3xl"
      />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              Book a free demo
            </h1>
            <p className="mt-6 text-base leading-relaxed text-body">
              Tell us what you drive and what keeps going wrong. We will show you the
              live map with a sample fleet and quote for your vehicle count — no
              commitment.
            </p>

            <dl className="mt-10 space-y-5">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-base text-ink">
                    {detail.href ? (
                      <a href={detail.href} className="hover:text-accent">
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}

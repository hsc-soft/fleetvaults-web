import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions governing your use of the Fleet Vaults website and GPS tracking services.",
};

export default function TermsAndConditionsPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Terms &amp; Conditions
        </h1>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-body">
          <p>
            These Terms &amp; Conditions govern your access to and use of the Fleet
            Vaults website and our GPS tracking and fleet management services (the
            &ldquo;Services&rdquo;). By accessing or using the Services, you agree to
            be bound by these Terms. If you do not agree, please do not use the
            Services.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-ink">Use of the Services</h2>
            <p className="mt-4">
              You agree to use the Services only for lawful purposes and in
              accordance with these Terms. You are responsible for ensuring that any
              vehicles or devices you track with our Services are owned by you or that
              you have the necessary authority and consent to track them.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Accounts</h2>
            <p className="mt-4">
              You are responsible for maintaining the confidentiality of any account
              credentials and for all activities that occur under your account. You
              agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Intellectual Property</h2>
            <p className="mt-4">
              All content, trademarks, logos, and material on this website are the
              property of Fleet Vaults or its licensors and are protected by
              applicable laws. You may not copy, reproduce, or distribute any part of
              the Services without our prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Service Availability</h2>
            <p className="mt-4">
              We strive to keep the Services available and accurate at all times;
              however, we do not guarantee uninterrupted or error-free operation.
              Location data and reports are provided for informational purposes and
              may be affected by factors outside our control, such as network
              coverage, GPS signal, or device condition.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Limitation of Liability</h2>
            <p className="mt-4">
              To the fullest extent permitted by law, Fleet Vaults shall not be liable
              for any indirect, incidental, or consequential damages arising out of or
              in connection with your use of, or inability to use, the Services,
              including any loss arising from reliance on location data or reports.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Third-Party Links</h2>
            <p className="mt-4">
              The Services may contain links to third-party websites or services that
              are not owned or controlled by Fleet Vaults. We are not responsible for
              the content or practices of any third-party sites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Changes to These Terms</h2>
            <p className="mt-4">
              We may update these Terms from time to time. Any changes will be posted
              on this page, so please review it at regular intervals. Your continued
              use of the Services following the posting of any changes constitutes
              your acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Governing Law</h2>
            <p className="mt-4">
              These Terms are governed by and construed in accordance with the laws of
              India, and any disputes shall be subject to the exclusive jurisdiction
              of the courts of Jaipur, Rajasthan.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Contact</h2>
            <p className="mt-4">
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:info@fleetvaults.com"
                className="font-medium text-accent hover:text-ink"
              >
                info@fleetvaults.com
              </a>
              . See also our{" "}
              <Link href="/privacy-policy" className="font-medium text-accent hover:text-ink">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="border-t border-line pt-6 text-sm text-muted">
            GPS Tracking &bull; Fleet Management
          </p>
        </div>
      </Container>
    </section>
  );
}

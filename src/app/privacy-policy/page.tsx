import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Fleet Vaults collects, uses, and protects your information for our GPS tracking and fleet management services.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-body">
          <p>
            On this page, we regard your information as significant and provide you
            with what information we collect and how we use it to personalize and
            continually improve your experience.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-ink">Information We Collect</h2>
            <div className="mt-4 space-y-4">
              <p>
                <span className="font-semibold text-ink">Personal Information.</span>{" "}
                Personal Information is not collected by us. &lsquo;Personal
                Information&rsquo; is information that identifies you or another
                person, such as your first name and last name, your physical
                addresses, email addresses, telephone, fax, SSN, or information which
                is being stored within your device.
              </p>
              <p>
                <span className="font-semibold text-ink">
                  Non-personal Information.
                </span>{" "}
                Your non-personal information is collected by us when you visit our
                website. Information you provide: we may collect your information when
                you communicate with us or you provide us with the information.
              </p>
              <p>We are only getting your mobile device ID.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">How We Use Information</h2>
            <div className="mt-4 space-y-4">
              <p>
                <span className="font-semibold text-ink">Personal Information.</span>{" "}
                We do not store any of your personal information and therefore we do
                not disclose any of your Personal Information.
              </p>
              <p>
                <span className="font-semibold text-ink">
                  Non-Personal Information.
                </span>{" "}
                We neither sell, trade, nor otherwise transfer your information to
                outside parties. Your Non-Personal Information is not combined with
                Personal Information by us (such as combining your name with your
                unique User Device number).
              </p>
              <p>
                We will use the Device Number for updating/deleting the GCM key from
                our app&rsquo;s database.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Legal Reasons</h2>
            <p className="mt-4">
              We will access, use or disclose your information with other
              organizations or entities keeping in mind any applicable law,
              regulation, legal process or enforceable governmental request; detect,
              prevent, or otherwise address fraud, security or technical issues; and
              protect against harm to the rights, property or safety of our company,
              our users or the public as required or permitted by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Security</h2>
            <p className="mt-4">
              Our company is very concerned about safeguarding the confidentiality of
              your information. We do not collect Personal Information, and we employ
              administrative, physical and electronic measures designed to protect
              your Non-Personal Information from any kind of unauthorized access and
              use. Please be aware that no security measures that we take to protect
              your information are absolutely guaranteed to avoid unauthorized access
              or use of your Non-Personal Information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Sensitive Information</h2>
            <p className="mt-4">
              We request that you not send us, and you not disclose, any sensitive
              Personal Information (e.g., information related to racial or ethnic
              origin, political opinions, religion or other beliefs, health, sexual
              orientation, criminal background or membership in past organizations,
              including trade union memberships) on or through an Application, the
              Services or the Site or otherwise to us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Children</h2>
            <p className="mt-4">
              We do not provide services focused on children. Therefore if you are
              under 18, you may visit our website when you are with a parent or
              guardian.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ink">Changes</h2>
            <p className="mt-4">
              Our Privacy Policy may change from time to time, which will not reduce
              your rights under this Privacy Policy. We will post any privacy policy
              changes on this page, so please review it at regular intervals. If you
              do not agree to any modifications to this Policy, you could immediately
              stop all use of the Services. Your continued use of the Site following
              the posting of any modifications to this Policy will constitute your
              acceptance of the revised Policy. Please note that none of our employees
              or agents has the authority to vary any of our Policies.
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

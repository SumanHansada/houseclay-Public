"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";
import { HOUSECLAY_SUPPORT } from "@/common/constants";
import { Footer, MobileHeader } from "@/layout-components";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>Privacy Policy</MobileHeader.Title>
      </MobileHeader>

      <section
        className="w-full"
        aria-labelledby="privacy-title privacy-title-mobile"
      >
        <div className="w-full text-center mb-8">
          {/* Desktop visible title */}
          <h1
            id="privacy-title"
            className="text-4xl font-bold py-24 max-md:hidden"
          >
            Privacy Policy
          </h1>
          {/* Mobile hidden (screen-reader only) title */}
          <h1 id="privacy-title-mobile" className="sr-only md:hidden">
            Privacy Policy
          </h1>
        </div>

        <div className="flex flex-col gap-8 xl:px-24 lg:px-12 md:px-8 px-4 mb-16 pb-4 mx-auto">
          <div className="flex flex-col gap-2 md:gap-1 font-semibold">
            <p className="flex max-md:flex-col gap-1">
              <span>Last Updated on </span>
              <span className="text-gray-700">22nd, December 2025</span>
            </p>
            <p className="flex max-md:flex-col gap-1">
              Houseclay.com refers to Elevensquare Technologies Pvt. Ltd.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              Acceptance of Policy
            </h2>
            <p className="text-gray-700 md:text-lg">
              Houseclay (&quot;<span className="font-medium">we</span>&quot;,
              &quot;<span className="font-medium">us</span>&quot;, &quot;
              <span className="font-medium">our</span>&quot;) operates the
              website, mobile applications, and related services (collectively,
              the &quot;<span className="font-medium">Platform</span>&quot;).
              Your privacy and the security of your personal information are top
              priorities. This Privacy Policy explains how Houseclay collects,
              uses, discloses, stores, and protects your Personal Data when you
              use our Platform or otherwise interact with us.
            </p>
            <p className="text-gray-700 md:text-lg">
              By accessing or using our Platform, or by providing Personal Data
              to us, you consent to the processing described in this Privacy
              Policy and agree to our Terms of Use.{" "}
              <span className="font-medium">
                If you do not agree, please do not use the Platform or submit
                any Personal Data
              </span>
              .
            </p>
          </div>

          {/* 1. Information We Collect */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              1. Information We Collect
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We collect information to provide and improve our services,
              personalise your experience, and to comply with legal obligations.
              This includes:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Personal Information You Provide
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 text-sm md:text-base text-gray-700">
                  <p>
                    <span className="font-medium">
                      Account and profile details
                    </span>
                    : name, mobile number, email address, date of birth, profile
                    photo.
                  </p>
                  <p>
                    <span className="font-medium">Verification data</span>:
                    documents or digital identity information for tenant/owner
                    verification.
                  </p>
                  <p>
                    <span className="font-medium">Property data</span>: property
                    details, photos, lease preferences, rental/ownership
                    history.
                  </p>
                  <p>
                    <span className="font-medium">
                      Financial/payment information
                    </span>
                    : bank account details, UPI handle, invoices, billing
                    addresses, transaction records (when you use ancillary
                    payment or agreement services).
                  </p>
                  <p>
                    <span className="font-medium">Communications</span>:
                    messages between users, support tickets, feedback, survey
                    responses.
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Automatically Collected Data
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 text-sm md:text-base text-gray-700">
                  <p>
                    <span className="font-medium">
                      Device & technical identifiers
                    </span>
                    : IP address, device identifiers, browser type, operating
                    system, crash logs.
                  </p>
                  <p>
                    <span className="font-medium">Usage data</span> : pages
                    viewed, actions taken, search queries, timestamps, feature
                    usage patterns.
                  </p>
                  <p>
                    <span className="font-medium">
                      Location data (with permission)
                    </span>
                    : approximate or precise GPS/location to show relevant local
                    listings.
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Cookies & Similar Technologies
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 text-sm md:text-base text-gray-700">
                  <p>
                    We use cookies and tracking technologies to enhance user
                    experience, remember preferences, and support analytics and
                    targeted messaging.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* 2) Use of Information */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              2. Use of Information
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We use your information to:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                Provide, operate, maintain, and improve the Platform and
                services.
              </li>
              <li>
                Authenticate accounts, verify identities, and secure access.
              </li>
              <li>Personalise recommendations (listings, offers, alerts).</li>
              <li>
                Process billing, payments, agreements, and service fulfillment.
              </li>
              <li>Communicate updates, alerts, and support responses.</li>
              <li>
                Analyse usage trends and perform data analytics to improve
                performance.
              </li>
              <li>
                Detect, prevent, and address fraud, security breaches, abusive
                activity, or illegal conduct.
              </li>
              <li>
                Comply with legal and regulatory obligations in India (including
                DPDP 2023 and applicable IT laws).
              </li>
            </ul>
          </div>

          {/* 3. Sharing and Disclosure */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              3. Sharing and Disclosure
            </h2>
            <p className="pt-2 ml-2 md:ml-4 md:text-lg text-gray-700">
              We may share your information as follows:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Service Providers
                </h3>
                <p>
                  To trusted third parties helping us operate the Platform
                  (e.g., cloud hosting, analytics, payment processors), under
                  contractual confidentiality restrictions.
                </p>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Legal Compliance
                </h3>
                <p>
                  When required by law enforcement, court order, subpoena,
                  regulatory requests, or to protect rights, property, safety,
                  and security of Houseclay or users.
                </p>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Business Transfers
                </h3>
                <p>
                  In the event of merger, acquisition, reorganisation,
                  financing, or sale of assets, your information may be
                  transferred as part of that transaction.
                </p>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  With Your Consent
                </h3>
                <p>
                  When you explicitly opt in (e.g., for marketing emails, SMS
                  alerts), or where Indian law permits.
                </p>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Advertising and Marketing
                </h3>
                <p>
                  For personalised advertisements or marketing campaigns powered
                  by third-party ad services, with clear opt-out mechanisms
                  where required.
                </p>
              </li>
            </ul>
          </div>

          {/* 4. Data Retention */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              4. Data Retention
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We retain Personal Data only as long as necessary to fulfil the
              purposes outlined in this policy, including for legal compliance,
              dispute resolution, fraud prevention, and legitimate business
              operations. After account deletion, some information may be
              retained to meet statutory obligations under Indian law.
            </p>
          </div>

          {/* 5. Your Rights & Choices */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              5. Your Rights & Choices
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Under applicable law (including the DPDP 2023), you may:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>Access, update, or correct your Personal Data.</li>
              <li>Request deletion or restriction of processing.</li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>Opt out of direct marketing communications.</li>
              <li>Request data portability.</li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              To exercise these rights, contact us at the details below. We will
              respond within a reasonable timeframe and in accordance with
              applicable law.
            </p>
          </div>

          {/* 6. Security of Personal Data */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              6. Security of Personal Data
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We implement reasonable technical, administrative, and
              organisational safeguards (encryption in transit, secure servers,
              access controls, periodic audits) to protect your data from
              unauthorised access, loss, misuse, or alteration. However, no
              system can be guaranteed 100% secure.
            </p>
          </div>

          {/* 7. Children’s Privacy */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              7. Children&apos;s Privacy
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              The Platform is not intended for users under the age of 18. We do
              not knowingly collect Personal Data from minors. If we learn that
              we have collected such information, we will take steps to delete
              it promptly.
            </p>
          </div>

          {/* 8. International Transfers */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              8. International Transfers
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Your Personal Data may be processed or stored in India or in other
              countries where we or our service providers operate. By using the
              Platform, you consent to such international data transfers
              consistent with applicable law.
            </p>
          </div>

          {/* 9. Changes to This Policy */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              9. Changes to This Policy
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may update this Privacy Policy to reflect changes in practices
              or legal requirements. Material changes will be notified by email
              or Platform notice before they take effect. Continued use after
              changes signifies acceptance.
            </p>
          </div>

          {/* 10. Contact Information */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              10. Contact Information
            </h2>
            <div className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <h3 className="font-semibold">Houseclay HQ</h3>
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  className="text-red-600 underline cursor-pointer"
                  href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                  aria-label={`Email ${HOUSECLAY_SUPPORT.email}`}
                >
                  {HOUSECLAY_SUPPORT.email}
                </a>
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {HOUSECLAY_SUPPORT.address}
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="max-md:hidden w-full">
        <Footer />
      </div>
    </>
  );
}

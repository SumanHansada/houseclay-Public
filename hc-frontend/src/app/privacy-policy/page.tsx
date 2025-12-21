"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";
import { Footer, MobileHeader } from "@/layout-components";
import { HOUSECLAY_SUPPORT } from "@/common/constants";

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
        <div className="flex flex-col gap-8 xl:w-1/2 lg:w-2/3 md:w-3/4 max-md:px-8 mb-16 pb-5 mx-auto">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              Acceptance of Policy
            </h2>
            <p className="text-gray-700 md:text-lg">
              This Privacy Policy explains how Houseclay ("Houseclay", "we",
              "us", "our") collects, uses, discloses, process and protects
              personal data when you use our website, apps, and services (the
              "Platform"). By using the Platform, you agree to this Policy. If
              you do not agree, please do not use the Platform.
            </p>
          </div>

          {/* 1. Scope & Roles */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              1) Scope & Roles
            </h2>
            <div className="space-y-2 md:space-y-1 pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <p>
                This Policy applies to visitors, listers, seekers, and any
                person interacting with the Platform ("Users", "you", "your").
              </p>
              <p>
                Houseclay acts as an independent data fiduciary/controller for
                personal data processed to operate and improve the Platform.
              </p>
            </div>
          </div>

          {/* 2. What We Collect */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              2) What We Collect
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We collect the following categories of data, depending on how you
              use the Platform:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Account & Identity
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Name, phone number, email, profile info, verification
                    status. We do not use passwords.
                  </p>
                  <p>
                    Authentication is performed via one-time passwords (OTP).
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Auth & Verification (OTP)
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Phone number used for OTP, OTP delivery/verification status,
                    limited fraud-prevention signals (e.g., device/IP, attempt
                    counters). We do not store OTPs in plain text and OTPs
                    expire shortly after issuance.
                  </p>
                  <p>
                    We may also collect feedback, complaints, call recordings
                    and WhatsApp communications where you contact our customer
                    support, solely for quality-assurance and
                    dispute-resolution.
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Messaging Identifiers (SMS & WhatsApp)
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Your phone/WhatsApp contact and message metadata when you
                    contact us or opt to receive messages via WhatsApp Business.
                    Message content is processed only as needed to provide
                    support or deliver the requested service.
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Listings & Interactions
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Listing details (title, description, location area, rent,
                    availability, photos, and any other detail required for
                    enabling listing), contact preference, claim/remove/opt-out
                    signals, messages or interest signals (where enabled).
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Usage & Device
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    IP address, device type, browser, OS, language, time zone,
                    referral source, pages viewed, actions (e.g., phone reveal),
                    session analytics, cookies or similar identifiers.
                  </p>
                  <p></p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Payments (for connects)
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Plan details, transaction IDs, masked card info, payment
                    status (processed via third-party payment providers) to the
                    extent permitted under applicable laws.
                  </p>
                  <p></p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Publicly Available or Authorised Information
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Rental-related information available publicly or from
                    authorised sources, organised for discovery on the Platform
                    (e.g., property details, lister display name, contact
                    information provided in such sources).
                  </p>
                  <p>
                    We generally do not collect contact details from private
                    channels (e.g., private messages) and rely on information
                    provided directly by Users or that is publicly available or
                    authorised.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* 3) How We Use Personal Data (Purposes)
           */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              3) How We Use Personal Data (Purposes)
            </h2>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Provide the Platform</span>:
                create/manage accounts, power search & discovery, display
                listings, enable contact flows.
              </li>
              <li>
                <span className="font-medium">Communication</span>:
                Communications (SMS, Email & WhatsApp Business), Send OTPs and
                transactional/service messages (e.g., claim/remove links,
                alerts, updates). With your consent where required, send
                promotional updates. You can manage preferences as described in
                Messaging Preferences (SMS & WhatsApp).
              </li>
              <li>
                <span className="font-medium">Safety & Trust</span>: prevent
                spam/fraud/abuse, rate-limit "reveal phone," investigate
                complaints, power report/takedown flows.
              </li>
              <li>
                <span className="font-medium">Improvement & Analytics</span>:
                diagnose issues, measure performance, understand feature usage,
                A/B test.
              </li>
              <li>
                <span className="font-medium">Payments</span>: manage
                subscriptions, billing, tax invoices.
              </li>
              <li>
                <span className="font-medium">Legal & Compliance</span>: respond
                to lawful requests, enforce Terms, protect our rights and Users.
              </li>
              <li>
                <span className="font-medium">Do-Not-List Registry</span>:
                honour "do not list" or "do not contact" preferences to avoid
                future display or re-ingestion of identifiers.
              </li>
            </ul>
          </div>

          {/* 4) Lawful Bases */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              4) Lawful Bases
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Depending on context, we process data on one or more of the
              following bases:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                To perform a contract with you (account, subscription,
                listings).
              </li>
              <li>
                Legitimate interests (operate, secure, and improve the Platform;
                organise publicly available/authorised information for rental
                discovery; prevent abuse; analytics).
              </li>
              <li>
                Consent where required (e.g., certain marketing communications,
                phone/SMS/WhatsApp where applicable).
              </li>
              <li>Legal obligations (tax, audit, law-enforcement requests).</li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              For WhatsApp Business messages, we rely on consent where required
              and on legitimate interests to deliver transactional messages you
              request (e.g., OTPs, claim/remove confirmations), consistent with
              WhatsApp's Business Terms and applicable law. For SMS, we comply
              with applicable telecom rules for transactional vs. promotional
              messaging.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Where applicable law permits, we may process publicly available
              personal data for the purposes described above.
            </p>
          </div>

          {/* 5) Cookies & Similar Technologies */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              5) Cookies & Similar Technologies
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We use cookies, local storage, and similar tools for core
              functionality (session, security) and analytics (e.g., event
              tracking, funnel analysis). You can control cookies via your
              browser settings; disabling them may impact features.
            </p>
          </div>

          {/* 6) Disclosures & Service Providers */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              6) Disclosures & Service Providers
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We share personal data only as needed to provide the Platform or
              as required by law:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Vendors/Processors</span>:
                hosting, storage, analytics, communications (email/SMS/WhatsApp
                Business providers), payment processing, customer support.
              </li>
              <li>
                <span className="font-medium">Other Users</span>: limited
                listing information and contact fields as configured by you or
                as presented from public/authorised sources for genuine rental
                inquiries.
              </li>
              <li>
                <span className="font-medium">Legal/Compliance</span>: courts,
                regulators, law enforcement where legally required or to protect
                rights, safety, and property.
              </li>
              <li>
                <span className="font-medium">Business Transfers</span>: in
                connection with mergers, acquisitions, or financing, subject to
                appropriate safeguards.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We do not sell personal data.
            </p>
          </div>

          {/* 7) Data Retention */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              7) Data Retention
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We retain data for as long as necessary to fulfill the purposes
              described or as required by law. Illustratively:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Accounts & Listings</span>: active
                use + a reasonable period for support/disputes/backup.
              </li>
              <li>
                <span className="font-medium">Logs/Analytics</span>: for
                security, fraud-prevention, and product improvement for a
                reasonable period.
              </li>
              <li>
                <span className="font-medium">Do-Not-List</span>: retained as
                necessary to honour the opt-out.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Upon valid removal/takedown, we delete or de-identify affected
              content from the Platform (backups may persist for a limited
              time).
            </p>
          </div>

          {/* 8) Your Choices & Rights */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              8) Your Choices & Rights
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Subject to verification and applicable law, you may:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>Access your personal data and request a copy.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>
                Delete/Remove your listing or profile, or request erasure where
                applicable.
              </li>
              <li>
                Opt out of promotional messages (transactional/service messages
                may continue).
              </li>
              <li>
                Do-Not-List: ask us to avoid displaying content associated with
                your phone/profile link in the future.
              </li>
              <li>
                Consent withdrawal where consent is the basis. In addition, you
                have the right to data portability, the right to restrict or
                object to certain processing, and the right to nominate another
                person to exercise your rights in the event of incapacity, as
                recognised under the DPDP Act.
              </li>
            </ul>
          </div>

          {/* 9) Messaging Preferences (SMS & WhatsApp) */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              9) Messaging Preferences (SMS & WhatsApp)
            </h2>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Opt-in/Out</span>: You may opt in
                to receive messages via SMS or WhatsApp Business and can opt out
                at any time (e.g., in-product toggle, account settings, or by
                replying STOP on WhatsApp where supported).
              </li>
              <li>
                <span className="font-medium">
                  Transactional vs Promotional
                </span>
                : You may still receive transactional or service-related
                messages (e.g., OTPs, claim/remove confirmations) where
                necessary to provide the Platform, even if you opt out of
                promotional communications.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Use in-product controls (e.g., Claim/Remove), the Report link on
              listings, or contact{" "}
              <a
                className="text-red-600 underline cursor-pointer"
                href={`mailto:${HOUSECLAY_SUPPORT.email}`}
              >
                {HOUSECLAY_SUPPORT.email}
              </a>
            </p>
          </div>

          {/* 10) Owner Controls: Claim / Remove / Opt-Out */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              10) Owner Controls: Claim / Remove / Opt-Out
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              If content displayed on Houseclay relates to your property or
              identifier:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Claim</span>: verify via OTP to
                manage/edit/pause/mark-as-filled/delete the listing.
              </li>
              <li>
                <span className="font-medium">Remove</span>: request deletion;
                we act promptly (typically within 24 hours) after verification.
              </li>
              <li>
                <span className="font-medium">Do-Not-List</span>: request we
                avoid displaying content associated with your phone/profile in
                the future.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may ask for limited proof (e.g., OTP to the listed phone) to
              prevent misuse.
            </p>
          </div>

          {/* 11) Security */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">11) Security</h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We implement reasonable technical and organisational safeguards.
              No system is 100% secure; report suspected issues promptly. We use
              rate-limited OTP verification with short expiry windows and do not
              store OTPs in plain text.
            </p>
          </div>

          {/* 12) International Transfers */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              12) International Transfers
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Our service providers and infrastructure may be located outside
              your state or country. Where data is transferred across borders,
              we apply reasonable safeguards consistent with applicable law.
            </p>
          </div>

          {/* 13) Children */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">13) Children</h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              The Platform is intended for adults (18+). We do not knowingly
              collect personal data from children. If you believe a child has
              provided data, contact us and we will take appropriate steps.
            </p>
          </div>

          {/* 14) Grievances & Contact */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              14) Grievances & Contact
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              For requests, questions, or complaints, contact our Grievance
              Officer / Data Protection Contact:
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700"></p>
            <div className="py-2 pl-2 md:pl-4 space-y-1 md:text-lg text-gray-700">
              <p>Houseclay</p>
              <p>
                Email:{" "}
                <a
                  className="text-red-600 underline cursor-pointer"
                  href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                >
                  {HOUSECLAY_SUPPORT.email}
                </a>
              </p>
            </div>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We aim to acknowledge and resolve grievances within reasonable
              timelines required by applicable law.
            </p>
          </div>

          {/* 15) Changes to this Policy */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              15) Changes to this Policy
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may update this Policy from time to time. We will revise the
              "Last Updated" date and, where required, provide additional
              notice. Your continued use of the Platform after changes take
              effect constitutes acceptance
            </p>
          </div>

          {/* 16) Indemnity, Liability & Third‑Party Content */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              16) Indemnity, Liability & Third‑Party Content
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Users are solely responsible for the accuracy of listings and
              communications. Houseclay is an online intermediary that provides
              a matching platform and does not guarantee listing quality,
              availability or legality. To the maximum extent permitted by law,
              Houseclay&apos;s aggregate liability for any claim shall not
              exceed the total fees paid by you in the preceding three months.
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  Governing Law & Jurisdiction
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    This Policy is governed by Indian law. Any dispute shall be
                    subject to exclusive jurisdiction of the competent courts in
                    Bengaluru, Karnataka.
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Force Majeure
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Houseclay shall not be liable for any delay or failure to
                    perform its obligations under this Policy or the Platform
                    Terms if such delay or failure results from events or
                    circumstances beyond Houseclay&apos;s reasonable control,
                    including but not limited to acts of God, fire, flood,
                    earthquake, explosion, war, terrorism, civil disorder,
                    pandemics, strikes, lock-outs, government orders, power
                    outages, or failures of telecommunications or internet
                    services. Upon occurrence of a force-majeure event,
                    Houseclay will make reasonable efforts to resume the
                    affected services as soon as practicable.
                  </p>
                </div>
              </li>

              <li>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Limitation Period
                </h3>
                <div className="space-y-2 md:space-y-1 pt-1 pl-2 md:pl-4 text-sm md:text-base text-gray-700">
                  <p>
                    Any claim, action, or proceeding arising out of or relating
                    to this Privacy Policy must be commenced within one (1) year
                    after the cause of action accrues; otherwise, such cause of
                    action is permanently barred.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <div className="max-md:hidden w-full">
        <Footer />
      </div>
    </>
  );
}

"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";
import { HOUSECLAY_SUPPORT } from "@/common/constants";
import { sanitizePhoneKeepCountryCode } from "@/common/utils";
import { Footer, MobileHeader } from "@/layout-components";

const formattedPhoneNumber = sanitizePhoneKeepCountryCode(
  HOUSECLAY_SUPPORT.phone,
);

export default function TermsAndConditionsPage() {
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
        <MobileHeader.Title>Terms and Conditions</MobileHeader.Title>
      </MobileHeader>

      <section
        className="w-full"
        aria-labelledby="terms-title terms-title-mobile"
      >
        <div className="w-full text-center mb-8">
          {/* Desktop visible title */}
          <h1
            id="terms-title"
            className="text-4xl font-bold py-24 max-md:hidden"
          >
            Terms and Conditions
          </h1>
          {/* Mobile hidden (screen-reader only) title */}
          <h1 id="terms-title-mobile" className="sr-only md:hidden">
            Terms and Conditions
          </h1>
        </div>
        <div className="flex flex-col gap-8 xl:w-1/2 lg:w-2/3 md:w-3/4 max-md:px-8 mb-16 pb-5 mx-auto">
          <div className="flex max-md:flex-col gap-1 font-semibold">
            <span>Last Modified:</span>
            <span className="text-gray-700 font-medium">
              22nd, December 2025 (22/12/2025)
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              Acceptance of Policy
            </h2>
            <p className="text-gray-700 md:text-lg">
              These Terms & Conditions (&quot;Terms&quot;) constitute a legally
              binding agreement between Houseclay (&quot;Houseclay&quot;,
              &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) and any person or
              entity that visits, accesses or uses our website, mobile site,
              applications, products or services (collectively, the
              &quot;Platform&quot;). By accessing or using the Platform, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and our privacy policy. If you do not agree, please
              do not use the Platform.
            </p>
          </div>

          {/* 1) Who We Are & What We Do */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              1) Who We Are & What We Do
            </h2>
            <div className="space-y-2 md:space-y-1 pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <p>
                Houseclay is an online venue that surfaces and organises
                rental-related information and enables communication between
                people who list accommodation and people who seek accommodation
                (collectively, &quot;Users&quot;, &quot;you&quot;,
                &quot;your&quot;). Houseclay acts solely as a technology service
                provider and is not a real-estate broker, agent, property
                manager, insurer, guarantor, escrow service, or lender. We do
                not own, manage, or control any properties, do not enter into
                rental agreements, and do not collect rent or brokerage on
                behalf of Users. For the avoidance of doubt, no partnership,
                joint-venture, agency, employment or fiduciary relationship is
                intended or created between Houseclay and any User.
              </p>
            </div>
          </div>

          {/* 2) Eligibility & Accounts */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              2) Eligibility & Accounts
            </h2>
            <div className="space-y-2 md:space-y-1 pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <p>
                You must be at least 18 years old or have verifiable guardian
                consent where required and capable of forming a binding contract
                under Indian law.
              </p>
              <p>
                You may be required to create an account and provide accurate,
                current, and complete information. You are responsible for
                safeguarding your login credentials and all activity under your
                account. You must promptly notify Houseclay of any unauthorised
                use or security breach.
              </p>
            </div>
          </div>

          {/* 3) Subscriptions, Fees & Payments */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              3) Subscriptions, Fees & Payments
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We offer free connects upon successful registration and email
              verification. Plan features, pricing, taxes, and billing cycles
              are shown at checkout or in your account. Prices include
              applicable GST
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Refunds</span>: Except where
                required by law, fees are non-refundable and non-transferable.
              </li>
              <li>
                <span className="font-medium">Payment Processing</span>:
                Payments are processed by third-party providers; we do not store
                card details. You authorise us and our processors to charge your
                selected payment method for subscription fees, taxes, and
                applicable charges.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may modify plan features or prices in the future. Your
              continued use after the effective date constitutes acceptance.
            </p>
          </div>

          {/* 4) Content on the Platform */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              4) Content on the Platform
            </h2>
            <ul className="pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2">
              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  4.1 User Content
                </h3>
                <p className="pt-1 pl-2 md:pl-4 md:text-lg text-gray-700">
                  Users may submit, upload, or otherwise make available text,
                  images, links, contact fields, and other materials (&quot;User
                  Content&quot;). By providing User Content, you represent and
                  warrant that:
                </p>
                <ul className="list-disc space-y-2 md:space-y-1 pt-1 pl-6 md:pl-8 text-sm md:text-base text-gray-700">
                  <li>
                    You own or have all necessary rights to the User Content;
                  </li>
                  <li>
                    Your User Content is accurate, lawful, and not misleading or
                    fraudulent;
                  </li>
                  <li>
                    Your User Content does not infringe any third-party rights,
                    including but not limited to intellectual property, privacy,
                    or publicity rights.
                  </li>
                </ul>
                <p className="pt-1 pl-2 md:pl-4 md:text-lg text-gray-700">
                  You grant Houseclay a worldwide, non-exclusive, royalty-free,
                  sublicensable, and transferable licence to host, store,
                  reproduce, modify, adapt, publish, translate, display,
                  distribute, and otherwise use your User Content solely to
                  operate, improve, market, train algorithms/AI models and
                  provide the Platform (including in emails, search results, and
                  social or promotional materials). This licence survives for a
                  commercially reasonable period after removal to the extent
                  copies are required for backups, audits, or legal compliance.
                </p>
                <p className="pt-1 pl-2 md:pl-4 md:text-lg text-gray-700">
                  You remain solely responsible for your User Content. Houseclay
                  does not guarantee any reach, views, impressions, or outcomes.
                </p>
              </li>

              <li>
                <h3 className="text-lg md:text-xl font-semibold">
                  4.2 Publicly Available Information
                </h3>
                <p className="pt-1 pl-2 md:pl-4 md:text-lg text-gray-700">
                  The Platform may surface, index, organise, cache, or display
                  rental-related information that is available publicly or from
                  authorised sources, and present it in a more structured or
                  searchable manner for User&apos;s convenience. If you are the
                  owner or authorised representative of content displayed on
                  Houseclay and do not want it to appear, you may mark your
                  property as rented out via the in-product controls or by
                  contacting{" "}
                  <a
                    className="text-red-600 underline cursor-pointer"
                    href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                  >
                    {HOUSECLAY_SUPPORT.email}
                  </a>
                  . Houseclay reserves the right to refuse or delay removal
                  where data are required to fulfil legal obligations or defend
                  legal claims.
                </p>
              </li>
            </ul>
          </div>

          {/* 5) Acceptable Use & Prohibited Activities */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              5) Acceptable Use & Prohibited Activities
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              You agree not to:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                Post or transmit unlawful, harmful, defamatory, obscene,
                hateful, harassing, discriminatory, or otherwise objectionable
                content.
              </li>
              <li>
                Misrepresent information, impersonate another person/entity, or
                list a property you are not authorised to offer.
              </li>
              <li>
                Collect, harvest, reveal, or misuse personal data of other Users
                except as necessary to communicate regarding a bona fide rental
                inquiry in accordance with applicable law.
              </li>
              <li>
                Copy, mirror, index, scrape, crawl, mine, or otherwise extract
                data from the Platform, or create derivative databases, except
                via features we expressly provide.
              </li>
              <li>
                Circumvent or attempt to circumvent any access control,
                rate-limit, or security measures. Engage in unauthorized
                practice of law or other regulated activities without proper
                licensing
              </li>
              <li>
                Interfere with the Platform&apos;s operation, introduce malware,
                perform load tests without consent, or use automated means not
                expressly permitted.
              </li>
              <li>
                Use the Platform for spam, unsolicited communications, or any
                commercial purpose unrelated to genuine rental discovery.
                Reverse engineer, decompile, or disassemble any part of the
                Platform; Encourage or facilitate any third party to do the
                foregoing.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may moderate, remove, or restrict access to any content or
              account that violates these Terms, applicable law, or our
              policies, without liability.
            </p>
          </div>

          {/* 6) Communications & Notifications */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              6) Communications & Notifications
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              By using the Platform or contacting us, you consent to receive
              transactional communications (e.g., OTPs, claim/remove links,
              service alerts) via email, SMS, phone, in-app, and WhatsApp
              Business. Promotional messages are sent only with your consent
              where required and you may opt out at any time (e.g., settings or
              replying STOP on WhatsApp where supported). Transactional messages
              necessary to provide the Platform may continue.
            </p>
          </div>

          {/* 7) Third-Party Sites & Services */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              7) Third-Party Sites & Services
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              The Platform may display links, embeds, or references to
              third-party sites, profiles, content, or services. Houseclay does
              not control or endorse third-party resources and is not
              responsible for their content, accuracy, policies, or practices.
              Your interactions with third parties are solely between you and
              such third parties.
            </p>
          </div>

          {/* 8) Intellectual Property */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              8) Intellectual Property
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              The Platform, including its compilations, selection, arrangement,
              look-and-feel, software, trademarks, logos, and other materials,
              is owned by Houseclay or its licensors and protected by applicable
              intellectual property laws. Except for the limited rights
              expressly granted, no licence is granted to you. You may not use
              any Houseclay marks or branding without our prior written
              permission.
            </p>
          </div>

          {/* 9) Reporting, Takedown & "Do-Not-List" */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              9) Reporting, Takedown & &quot;Do-Not-List&quot;
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              If you believe content on the Platform infringes your rights or
              should not appear:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>Use the &quot;Report&quot; controls where provided; or</li>
              <li>
                Email{" "}
                <a
                  className="text-red-600 underline cursor-pointer"
                  href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                >
                  {HOUSECLAY_SUPPORT.email}
                </a>{" "}
                or WhatsApp us on{" "}
                <a
                  className="text-red-600 underline cursor-pointer"
                  href={`https://wa.me/${formattedPhoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {HOUSECLAY_SUPPORT.phone}
                </a>{" "}
                with the URL(s), a description of your request, and proof of
                authority.
              </li>
            </ul>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Upon receiving a valid request, we will act promptly, which may
              include removal, account restrictions, or other appropriate steps.
              You may also request that your phone number, profile link, or
              other identifiers be added to a Do-Not-List so that we avoid
              displaying content associated with those identifiers in the
              future, subject to reasonable verification. Houseclay may require
              reasonable proof of ownership or authority, and may retain
              archival copies for legal, audit, or compliance purposes even
              after public removal.
            </p>
          </div>

          {/* 10) Data Protection & Privacy */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              10) Data Protection & Privacy
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Your use of the Platform is subject to our privacy policy, which
              explains how we collect, use, disclose, and protect personal data,
              including data that may be publicly available and displayed for
              rental discovery. We apply reasonable security measures and retain
              data only as long as necessary for the purposes described or as
              required by law. Please review the Privacy Policy carefully. In
              the event of any conflict between these Terms and the Privacy
              Policy on matters of personal data processing, the Privacy Policy
              will prevail.
            </p>
          </div>

          {/* 11) Renter Safety & Self-Verification */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              11) Renter Safety & Self-Verification
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Always visit in person, verify ownership papers, insist on rent
              receipts and, where possible, police-verify flatmates and owners.
              Houseclay neither visits nor certifies any property.
            </p>
          </div>

          {/* 12) Disclaimers */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              12) Disclaimers
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Platform &quot;As Is&quot;</span>:
              The Platform is provided on an &quot;as-is&quot; and
              &quot;as-available&quot; basis. To the fullest extent permitted by
              law, Houseclay disclaims all warranties, express or implied,
              including merchantability, fitness for a particular purpose,
              title, and non-infringement.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">No Professional Advice</span>:
              Information on the Platform is for general informational purposes
              only and does not constitute legal, financial, or real-estate
              advice.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Full Guarantee</span>: We guarantee
              that properties are available, accurately described, safe,
              compliant with laws, or that Users will respond or transact.
            </p>
          </div>

          {/* 13) Limitation of Liability */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              13) Limitation of Liability
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              To the maximum extent permitted by law, Houseclay and its
              affiliates, directors, officers, employees, and agents will not be
              liable for any indirect, incidental, special, consequential,
              exemplary, or punitive damages, or for loss of profits, revenues,
              goodwill, data, or other intangible losses, arising out of or
              related to your use of (or inability to use) the Platform.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              In no event will our aggregate liability for all claims relating
              to the Platform exceed the greater of (a) the total amount you
              paid to FlatX in the three (3) months preceding the event giving
              rise to the claim.
            </p>
          </div>

          {/* 14) Indemnity */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">14) Indemnity</h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              You agree to indemnify, defend, and hold harmless Houseclay and
              its affiliates, directors, officers, employees, and agents from
              and against any claims, demands, liabilities, damages, losses,
              costs, and expenses (including reasonable attorneys&apos; fees)
              arising from or related to: (a) your use of the Platform; (b) your
              User Content; (c) your breach of these Terms or applicable law; or
              (d) your infringement or misappropriation of any rights of a third
              party.
            </p>
          </div>

          {/* 15) Suspension & Termination */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              15) Suspension & Termination
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may suspend or terminate your access to the Platform (in whole
              or in part) at any time, with or without notice, if we reasonably
              believe you have violated these Terms, our policies, or applicable
              law, or to protect the Platform or other Users. You may stop using
              the Platform at any time. Sections that by their nature should
              survive will survive termination (including 4-15).
            </p>
          </div>

          {/* 16) Changes to the Platform or Terms */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              16) Changes to the Platform or Terms
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may modify the Platform and update these Terms from time to
              time. When we make material changes, we will update the &quot;Last
              Updated&quot; date and, where required by law, provide additional
              notice. Your continued use after the effective date constitutes
              acceptance of the updated Terms. Your responsibility to check and
              be updated of the terms
            </p>
          </div>

          {/* 17) Governing Law, Jurisdiction & Dispute Resolution */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              17) Governing Law, Jurisdiction & Dispute Resolution
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              These Terms are governed by the laws of India, without regard to
              conflict-of-laws principles. Subject to the arbitration clause
              below, the courts at Bengaluru, Karnataka will have exclusive
              jurisdiction. Parties must first attempt good-faith negotiation
              for 15 days, if not then arbitration.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Arbitration. Any dispute arising out of or in connection with
              these Terms or the Platform shall be referred to and finally
              resolved by binding arbitration under the Arbitration and
              Conciliation Act, 1996. The seat and venue of arbitration shall be
              Bengaluru, Karnataka. The tribunal shall consist of one (1)
              arbitrator appointed jointly by the parties, or failing agreement,
              in accordance with the Act appointed in accordance with the Act.
              The language of arbitration shall be English. Each party will bear
              its own costs; fees of the tribunal shall be shared equally unless
              otherwise determined in the award. Notwithstanding the foregoing,
              either party may seek interim or injunctive relief from a court of
              competent jurisdiction.
            </p>
          </div>

          {/* 18) Miscellaneous */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              18) Miscellaneous
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Entire Agreement</span>: These
              Terms, together with the Privacy Policy and any plan-specific
              terms, constitute the entire agreement between you and Houseclay.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">No Waiver</span>: Our failure to
              enforce any provision is not a waiver.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Severability</span>: If any
              provision is held invalid or unenforceable, the remaining
              provisions will continue in full force and effect.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Assignment</span>: You may not
              assign or transfer these Terms without our prior written consent.
              We may assign these Terms in connection with a merger,
              acquisition, financing, or sale of assets.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Force Majeure</span>: We are not
              liable for any delay or failure caused by events beyond our
              reasonable control.
            </p>
          </div>

          {/* 19) Contact */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">19) Contact</h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              If you have any questions about these Terms, please contact us at{" "}
              <a
                className="text-red-600 underline cursor-pointer"
                href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                aria-label={`Email ${HOUSECLAY_SUPPORT.email}`}
              >
                {HOUSECLAY_SUPPORT.email}
              </a>{" "}
              or{" "}
              <a
                className="text-red-600 underline cursor-pointer"
                href={`tel:${formattedPhoneNumber}`}
                aria-label={`Call ${HOUSECLAY_SUPPORT.phone}`}
              >
                {HOUSECLAY_SUPPORT.phone}
              </a>
            </p>
          </div>
        </div>
      </section>
      <div className="max-md:hidden w-full">
        <Footer />
      </div>
    </>
  );
}

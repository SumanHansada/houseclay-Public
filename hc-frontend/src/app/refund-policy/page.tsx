"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";
import { HOUSECLAY_SUPPORT } from "@/common/constants";
import { Footer, MobileHeader } from "@/layout-components";

export default function RefundPolicyPage() {
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
        <MobileHeader.Title>Refund & Cancellation Policy</MobileHeader.Title>
      </MobileHeader>

      <section
        className="w-full"
        aria-labelledby="refund-title refund-title-mobile"
      >
        <div className="w-full text-center mb-8">
          {/* Desktop visible title */}
          <h1
            id="refund-title"
            className="text-4xl font-bold py-24 max-md:hidden"
          >
            Refund & Cancellation Policy (Connects)
          </h1>
          {/* Mobile hidden (screen-reader only) title */}
          <h1 id="refund-title-mobile" className="sr-only md:hidden">
            Refund Policy
          </h1>
        </div>

        <div className="flex flex-col gap-8 xl:px-28 lg:px-14 md:px-8 px-6 mb-16 pb-4 mx-auto">
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
              This Refund & Cancellation Policy (&quot;
              <span className="font-medium">Policy</span>&quot;) applies to
              purchases made on Houseclay for{" "}
              <span className="font-medium">Connects</span> (digital credits
              used to unlock property-owner contact details).
            </p>
          </div>

          {/* 1. What are Connects? */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              1. What are Connects?
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <span className="font-medium">Connects</span> are digital credits
              you purchase on Houseclay. When you use Connects, they are{" "}
              <span className="font-medium">consumed</span> to unlock a
              property&apos;s owner contact details.
            </p>
          </div>

          {/* 2. Cancellations */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              2. Cancellations
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Because Connects are delivered digitally (and may be used
              instantly),{" "}
              <span className="font-medium">
                cancellation after successful crediting is generally not
                possible
              </span>
              .
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Houseclay will not impose unfair cancellation charges in cases
              where cancellation is permitted/processed under applicable
              rules.{" "}
            </p>
          </div>

          {/* 3. When a refund is applicable */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              3. When a refund is applicable
            </h2>
            <p className="pt-2 ml-2 md:ml-4 md:text-lg text-gray-700">
              Refunds may be approved in the following cases:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">
                  Payment deducted but Connects not credited
                </span>{" "}
                to your account due to a technical error (after verification).
              </li>
              <li>
                <span className="font-medium">Duplicate payment</span> / charged
                multiple times for the same order.
              </li>
              <li>
                <span className="font-medium">Wrong amount charged</span> due to
                a billing/technical issue.
              </li>
              <li>
                <span className="font-medium">
                  Order marked successful but unlock failed
                </span>{" "}
                due to a platform issue (we may refund/re-credit the equivalent
                Connects or process a refund, after verification).
              </li>
            </ul>
            <p className="pt-2 ml-2 md:ml-4 md:text-lg text-gray-700">
              For accepted refund requests, Houseclay will process refunds
              within a reasonable period as required under applicable
              rules.{" "}
            </p>
          </div>

          {/* 4. Re-credit for incorrect contact details */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              4. Re-credit for incorrect contact details
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              If the unlocked contact details are{" "}
              <span className="font-medium">materially incorrect</span> (e.g.,
              invalid number/wrong person) and you raise a request within{" "}
              <span className="font-medium">24 Hours</span> of unlock with
              supporting details, Houseclay may, after verification,{" "}
              <span className="font-medium">
                re-credit the Connects used for that unlock
              </span>{" "}
              (preferred resolution) or provide an equivalent alternative. Based
              on company discretion.
            </p>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Note: This does <span className="font-medium">not</span> apply
              when the owner is valid but does not answer, is unavailable,
              refuses, or negotiations don&apos;t work out.
            </p>
          </div>

          {/* 5. When refunds are not applicable */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              5. When refunds are not applicable
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Refunds are typically not provided for:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                <span className="font-medium">Used/consumed Connects</span>{" "}
                (once an unlock is completed)
              </li>
              <li>
                <span className="font-medium">Change of mind</span> after
                purchase
              </li>
              <li>
                Inability to contact the owner due to reasons outside
                Houseclay&apos;s control (no response, busy, switched off, etc.)
              </li>
              <li>
                Account actions taken due to suspected fraud/misuse or violation
                of Houseclay Terms
              </li>
              <li>
                If the property is already rented out or owner has changed
                his/her/their mind not to Rent it out.
              </li>
            </ul>
          </div>

          {/* 6. Refund method and timeline */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              6. Refund method and timeline
            </h2>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>
                Approved refunds are processed to the{" "}
                <span className="font-medium">original payment method</span>{" "}
                (UPI/card/netbanking) unless restricted by payment rails.
              </li>
              <li>
                Houseclay aims to <span className="font-medium">initiate</span>{" "}
                approved refunds within{" "}
                <span className="font-medium">5-7 business days</span>; your
                bank/PSP may take additional time to reflect it.
              </li>
              <li>
                If the resolution is{" "}
                <span className="font-medium">re-credit</span>, Connects are
                added back to your account within{" "}
                <span className="font-medium">24-48 hours</span> after approval.
              </li>
            </ul>
          </div>

          {/* 7. How to request a refund / re-credit */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              7. How to request a refund / re-credit
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Contact us with:
            </p>
            <ul className="list-disc pt-2 ml-6 md:ml-8 text-gray-700 md:text-lg space-y-2 md:space-y-1">
              <li>Registered mobile number/email</li>
              <li>Order ID / transaction reference</li>
              <li>Date/time of purchase or unlock</li>
              <li>
                Reason + proof (screenshots, error message, call outcome if
                relevant)
              </li>
            </ul>
            <div className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              <p>
                <span className="font-medium">Support Email:</span>{" "}
                <a
                  className="text-red-600 underline cursor-pointer"
                  href={`mailto:${HOUSECLAY_SUPPORT.email}`}
                  aria-label={`Email ${HOUSECLAY_SUPPORT.email}`}
                >
                  {HOUSECLAY_SUPPORT.email}
                </a>
              </p>
              <p>
                <span className="font-medium">Support Hours:</span> 9AM - 6PM
                IST (Mon-Fri)
              </p>
            </div>
          </div>

          {/* 8. Grievance redressal */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              8. Grievance redressal
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              Houseclay maintains a grievance redressal mechanism and a
              Grievance Officer. Complaints are acknowledged within{" "}
              <span className="font-medium">48 hours</span> and addressed within{" "}
              <span className="font-medium">1 month</span>.{" "}
            </p>
            <div className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
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

          {/* 9. Changes to This Policy */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              9. Changes to This Policy
            </h2>
            <p className="pt-2 pl-2 md:pl-4 md:text-lg text-gray-700">
              We may update this Policy from time to time. The latest version
              will always be available on the Houseclay website/app with an
              updated effective date.
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

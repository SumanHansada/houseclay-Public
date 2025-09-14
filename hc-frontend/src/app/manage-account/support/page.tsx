"use client";

import { Mail, PhoneCall } from "lucide-react";
import { useState } from "react";

import { SUPPORT_CONTACT, SUPPORT_EMAIL } from "@/common/constants";
import { default as ACCORDION_DATA } from "@/data/SupportAccordionData.json";
import { MobileHeader } from "@/layout-components";
import { SvgIcon } from "@/utility-components";

import { Accordion } from "../components/Accordion";

export default function SupportPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Page title */}
        <div className="border-b-2 pb-2 mb-8">
          <h1 className="text-2xl font-medium">Contact Support</h1>
        </div>

        <div className="lg:px-8">
          {/* Support */}
          <div className="flex max-lg:flex-col max-lg:items-center gap-3 2xl:justify-between pb-16">
            <p className="text-lg font-medium tracking-wide lg:hidden">
              In case you have any questions, Reach out to us through the
              following channels:
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <SvgIcon iconSize="large" name="contact-support" size={360} />
              </div>
              <div className="text-lg">
                <p className="w-11/12 mb-8 tracking-wide max-lg:hidden">
                  In case you have any questions, Reach out to us through the
                  following channels:
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 mb-4"
                >
                  <Mail size={25} className="text-red-500" strokeWidth={1.25} />
                  <span>{SUPPORT_EMAIL}</span>
                </a>
                <a
                  href={`tel:${SUPPORT_CONTACT}`}
                  className="flex gap-2 items-start"
                >
                  <PhoneCall
                    size={25}
                    className="text-red-500"
                    strokeWidth={1.25}
                  />
                  <div className="flex flex-col">
                    <span>{SUPPORT_CONTACT}</span>
                    <span className="text-sm text-gray-700">
                      (9 AM &ndash; 7 PM, Mon &ndash; Sat)
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-8">
            <div className="w-11/12 lg:w-2/3 text-center mx-auto">
              <h1 className="text-3xl font-medium mb-4">
                Frequently asked questions
              </h1>
              <p className="text-lg tracking-wide text-gray-700">
                Got questions? We&apos;ve got answers! In this section, we
                address the most common inquiries about HouseClay
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {ACCORDION_DATA.map((item) => {
                const key = item.question;
                const isOpen = openKey === key;
                return (
                  <Accordion
                    key={key}
                    question={item.question}
                    answer={item.answer}
                    isOpen={isOpen}
                    onToggle={() => setOpenKey(isOpen ? null : key)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden mb-16">
        <MobileHeader title="Support" />

        <div className="px-8 space-y-6">
          {/* Support */}
          <div className="py-6">
            <h1 className="text-lg font-medium mb-6">
              In case you have any questions, Reach out to us through the
              following channels:
            </h1>

            <div className="flex gap-2 w-full items-center">
              <div className="w-1/3 sm:w-2/5">
                <SvgIcon iconSize="large" name="contact-support" size={200} />
              </div>
              <div className="w-2/3 sm:w-3/5 p-1">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 mb-4"
                >
                  <div>
                    <Mail
                      size={25}
                      className="text-red-500"
                      strokeWidth={1.25}
                    />
                  </div>
                  <span className="">{SUPPORT_EMAIL}</span>
                </a>
                <a
                  href={`tel:${SUPPORT_CONTACT}`}
                  className="flex gap-2 items-start"
                >
                  <div>
                    <PhoneCall
                      size={25}
                      className="text-red-500"
                      strokeWidth={1.25}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>{SUPPORT_CONTACT}</span>
                    <span className="text-sm text-gray-700">
                      (9 AM &ndash; 7 PM, Mon &ndash; Sat)
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="">
            <div className="space-y-2">
              <h1 className="text-lg font-medium mb-4">
                Frequently asked questions
              </h1>
              <p className="tracking-wide text-gray-700">
                Got questions? We&apos;ve got answers! In this section, we
                address the most common inquiries about HouseClay
              </p>
            </div>

            <div className="flex flex-col gap-3 py-5">
              {ACCORDION_DATA.map((item) => {
                const key = item.question;
                const isOpen = openKey === key;
                return (
                  <Accordion
                    key={key}
                    question={item.question}
                    answer={item.answer}
                    isOpen={isOpen}
                    onToggle={() => setOpenKey(isOpen ? null : key)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

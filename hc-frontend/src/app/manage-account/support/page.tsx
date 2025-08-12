"use client";

import Image from "next/image";
import PhoneIconSvg from "public/icons/phone.svg";
import MailIconSvg from "public/icons/mail.svg";

import {
  SUPPORT_ACCORDION,
  SUPPORT_CONTACT,
  SUPPORT_EMAIL,
} from "@/common/constants";
import { Accordion } from "../components/Accordion";
import { useState } from "react";

const PhoneIcon = PhoneIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MailIcon = MailIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export default function SupportPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      {/* Page title */}
      <div className="border-b-2 pb-2 mb-8">
        <h1 className="text-2xl font-medium">Contact Support</h1>
      </div>

      <div className="px-8">
        <div className="flex justify-between pb-16">
          <Image
            src="/icons/static-pages/contact-support.svg"
            alt="contact support"
            width={360}
            height={360}
          />
          <div className="text-lg">
            <p className="w-11/12 mb-8 tracking-wide">
              In case you have any questions, Reach out to us through the
              following channels:
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 mb-4"
            >
              <MailIcon width={25} className="text-red-500" />
              <span>{SUPPORT_EMAIL}</span>
            </a>
            <a
              href={`tel:${SUPPORT_CONTACT}`}
              className="flex gap-2 items-start"
            >
              <PhoneIcon width={25} className="text-red-500 pt-2" />
              <div className="flex flex-col">
                <span>{SUPPORT_CONTACT}</span>
                <span className="text-sm text-gray-700">
                  (9 AM &ndash; 7 PM, Mon &ndash; Sat)
                </span>
              </div>
            </a>
          </div>
        </div>

        <div className="space-y-8">
          <div className="w-2/3 text-center mx-auto">
            <h1 className="text-3xl font-medium mb-4">
              Frequently asked questions
            </h1>
            <p className="text-lg tracking-wide text-gray-700">
              Got questions? We&apos;ve got answers! In this section, we address
              the most common inquiries about HouseClay
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {SUPPORT_ACCORDION.map((item) => {
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
    </>
  );
}

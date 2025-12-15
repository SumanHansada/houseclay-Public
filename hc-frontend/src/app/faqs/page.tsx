"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/base-components";
import { default as ACCORDION_DATA } from "@/data/SupportAccordionData.json";
import { Footer, MobileHeader } from "@/layout-components";

import { Accordion } from "../manage-account/components/Accordion";

export default function FrequentlyAskedQuestionPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
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
        <MobileHeader.Title>Frequently Asked Questions</MobileHeader.Title>
      </MobileHeader>
      <section
        aria-labelledby="faq-title faq-title-mobile"
        className="space-y-12 md:space-y-24 xl:w-1/2 lg:w-2/3 md:w-3/4 md:py-20 max-md:px-8 pb-16 pt-12 mx-auto"
      >
        <div className="mx-auto w-11/12 text-center">
          {/* Desktop visible title */}
          <h1 id="faq-title" className="text-4xl font-bold mb-16 max-md:hidden">
            Frequently Asked Questions
          </h1>
          {/* Mobile hidden (screen-reader only) title */}
          <h1 id="faq-title-mobile" className="sr-only md:hidden">
            Frequently Asked Questions
          </h1>
          <p className="md:text-xl text-gray-600 md:text-gray-800 w-full">
            Got questions? We&apos;ve got answers! In this section, we address
            the most common inquiries about HouseClay
          </p>
        </div>
        <section aria-labelledby="faq-list" className="flex flex-col gap-5">
          <h2 id="faq-list" className="sr-only">
            Questions list
          </h2>
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
        </section>
      </section>
      <div className="max-md:hidden w-full">
        <Footer />
      </div>
    </>
  );
}

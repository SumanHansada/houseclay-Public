"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { SUPPORT_ACCORDION } from "@/common/dataConstants";
import { Footer, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";

import { Accordion } from "../manage-account/components/Accordion";

export default function FrequentlyAskedQuestionPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [isMobile, dispatch]);

  return (
    <>
      <MobileHeader title="Frequently Asked Questions" />

      <section className="space-y-12 md:space-y-24 xl:w-1/2 lg:w-2/3 md:w-3/4 md:py-20 max-md:px-8 pb-16 pt-12">
        <div className="mx-auto w-11/12 text-center">
          <h1 className="text-4xl font-bold mb-16 max-md:hidden">
            Frequently Asked Questions
          </h1>
          <p className="md:text-xl text-gray-600 md:text-gray-800 w-full">
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
      </section>
      <div className="max-md:hidden w-full">
        <Footer />
      </div>
    </>
  );
}

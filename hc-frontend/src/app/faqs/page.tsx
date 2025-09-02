"use client";

import { SUPPORT_ACCORDION } from "@/common/constants";
import { useEffect, useState } from "react";
import { Accordion } from "../manage-account/components/Accordion";
import { Footer } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDispatch } from "react-redux";
import { setHideFooter, setHideHeader } from "@/store/appSlice";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function FrequentlyAskedQuestionPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const router = useRouter();

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
      <header
        className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white md:hidden"
        role="banner"
      >
        <div className="flex items-center h-full px-4">
          {/* Left: fixed width placeholder to keep center stable */}
          <div className="shrink-0 w-10 h-10 flex items-center justify-start">
            <button
              aria-label="Go back"
              className="rounded-full w-10 h-10 border flex items-center justify-center"
              onClick={() => router.back()}
            >
              <ChevronLeft size={22} />
            </button>
          </div>

          {/* Center: grows and truly centers the title */}
          <div className="flex-1 px-2">
            <h1 className="text-lg text-center font-medium truncate">
              Frequently Asked Questions
            </h1>
          </div>

          {/* Right: same fixed width as left */}
          <div className="shrink-0 w-10 h-10 flex items-center justify-end">
            {null}
          </div>
        </div>
      </header>
      <section className="space-y-12 md:space-y-24 xl:w-1/2 lg:w-2/3 md:w-3/4 md:py-20 max-md:px-8 pb-16 pt-12">
        <div className="mx-auto w-11/12 text-center">
          <h1 className="text-4xl font-bold mb-16 max-md:hidden">
            Frequently Asked Questions
          </h1>
          <p className="md:text-xl text-gray-600 md:text-gray-800 w-full">
            Got questions? We've got answers! In this section, we address the
            most common inquiries about HouseClay
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
      <div className="max-md:hidden">
        <Footer />
      </div>
    </>
  );
}

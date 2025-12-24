"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import { Button } from "@/base-components";
import {
  Footer,
  MobileFooter,
  MobileHeader,
  PageTransition,
} from "@/layout-components";

export default function WhatAreConnectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={handleBackClick}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>What are Connects?</MobileHeader.Title>
      </MobileHeader>
      <PageTransition
        transitionType="slideRight"
        backTransitionType="slideLeft"
      >
        {children}
      </PageTransition>

      <MobileFooter>
        <div className="flex justify-end w-full">
          <button
            onClick={() => router.push("/buy-connects")}
            className="text-center border border-red-500 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-200"
          >
            Buy Connects Now
          </button>
        </div>
      </MobileFooter>

      {/* Desktop Footer */}
      <Footer />
    </>
  );
}

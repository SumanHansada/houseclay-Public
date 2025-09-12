"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Footer, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";

import ConnectsMobileFooter from "./components/ConnectsMobileFooter";
import HeroSection from "./components/HeroSection";
import HowToUseConnectsClient from "./components/HowToUseConnectsClient";
import WhatAreConnects from "./components/WhatAreConnects";
import WhyChooseConnectsClient from "./components/WhyChooseConnectsClient";

export default function WhatAreConnectsPage() {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
      dispatch(setHideStickyNavBar(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
      dispatch(setHideStickyNavBar(false));
    }
  }, [dispatch, isMobile]);

  return (
    <>
      <MobileHeader title="What are Connects?" />

      <div className="w-full">
        {/* Hero Section */}
        <section className="relative w-full md:aspect-[3/1] xl:aspect-[15/4]">
          <HeroSection />
        </section>

        {/* What are connects? Section */}
        <section className="min-h-[200px] w-full overflow-hidden">
          <WhatAreConnects />
        </section>

        {/* How can you use connects? Section */}
        <section className="min-h-[400px] w-full overflow-hidden">
          <HowToUseConnectsClient />
        </section>

        {/* Why choose connects? Section */}
        <section className="min-h-[400px] w-full overflow-hidden">
          <WhyChooseConnectsClient />
        </section>

        {/* Desktop Footer */}
        <div className="max-md:hidden">
          <Footer />
        </div>
      </div>

      <ConnectsMobileFooter
        onBuyConnects={() => router.push("/buy-connects")}
      />
    </>
  );
}

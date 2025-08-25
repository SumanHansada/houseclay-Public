"use client";

import { Footer, MobileHeader } from "@/layout-components";

import HeroSection from "./components/HeroSection";
import HowToUseConnectsClient from "./components/HowToUseConnectsClient";
import WhatAreConnects from "./components/WhatAreConnects";
import WhyChooseConnectsClient from "./components/WhyChooseConnectsClient";
import ConnectsFooter from "./components/ConnectsFooter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import {
  resetUIState,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";

export default function WhatAreConnectsPage() {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHideHeader(isMobile));
    dispatch(setHideStickyNavBar(true));
    return () => {
      dispatch(setHideStickyNavBar(false));
    };
  }, [dispatch, isMobile]);

  const handleBuyConnects = () => {
    console.log("Redirect to Buy Connects page!");
  };

  return (
    <>
      <MobileHeader title="What are Connects?" />

      <div className="w-full">
        {/* Hero Section */}
        <section className="relative min-h-[200px] md:h-[500px] xl:h-[600px] w-full overflow-hidden">
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
        <div className="md:block hidden">
          <Footer />
        </div>
      </div>

      <ConnectsFooter onBuyConnects={handleBuyConnects} />
    </>
  );
}

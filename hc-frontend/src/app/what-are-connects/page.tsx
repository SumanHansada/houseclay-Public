import Footer from "@/components/Footer";
import WhyChooseConnectsClient from "./components/WhyChooseConnectsClient";
import HowToUseConnectsClient from "./components/HowToUseConnectsClient";
import WhatAreConnects from "./components/WhatAreConnects";
import HeroSection from "./components/HeroSection";

export default function WhatAreConnectsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full max-md:hidden">
        <HeroSection />
      </section>
      {/* Mobile Hero Section */}
      <section
        className={"min-h-[500px] w-full overflow-hidden md:hidden"}
      ></section>

      {/* What are connects? Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <WhatAreConnects />
      </section>

      {/* How can you use connects? Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <HowToUseConnectsClient />
      </section>

      {/* Why choose connects? Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <WhyChooseConnectsClient />
      </section>
      <Footer />
    </>
  );
}

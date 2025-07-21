import Footer from "@/components/Footer";

import HeroSection from "./components/HeroSection";
import HowToUseConnectsClient from "./components/HowToUseConnectsClient";
import WhatAreConnects from "./components/WhatAreConnects";
import WhyChooseConnectsClient from "./components/WhyChooseConnectsClient";

export default function WhatAreConnectsPage() {
  return (
    <>
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
      <Footer />
    </>
  );
}

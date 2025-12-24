import HeroSection from "./components/HeroSection";
import HowToUseConnectsClient from "./components/HowToUseConnectsClient";
import WhatAreConnects from "./components/WhatAreConnects";
import WhyChooseConnectsClient from "./components/WhyChooseConnectsClient";

export default function WhatAreConnectsPage() {
  return (
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
    </div>
  );
}

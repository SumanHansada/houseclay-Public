import { Suspense } from "react";

import MastheadDesktopClient from "@/components/MastheadDesktopClient";
import MastHeadMobileClient from "@/components/MastheadMobileClient";
import PropertiesData from "@/data/PropertiesData.json";
import { Footer } from "@/layout-components";

import ClientPage from "./ClientPage";

export default async function Home() {
  const testimonials = PropertiesData.testimonials;

  return (
    <>
      {/* Masthead Desktop Section */}
      <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full max-md:hidden">
        <MastheadDesktopClient />
      </section>
      {/* Masthead Mobile Section */}
      <section className={"min-h-[500px] w-full overflow-hidden md:hidden"}>
        <MastHeadMobileClient />
      </section>

      {/* Client-side interactive components */}
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPage testimonials={testimonials} />
      </Suspense>

      <Footer />
    </>
  );
}

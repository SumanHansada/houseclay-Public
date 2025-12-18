import { Suspense } from "react";

import MastheadDesktopClient from "@/components/MastheadDesktopClient";
import MastHeadMobileClient from "@/components/MastheadMobileClient";
import TESTIMONIALS_DATA from "@/data/TestimonialsData.json";
import { Footer } from "@/layout-components";

import ClientPage from "./ClientPage";

export default async function Home() {
  const testimonials = TESTIMONIALS_DATA;

  return (
    <>
      {/* Masthead Desktop Section */}
      <section className="relative xl:h-[700px] lg:h-[600px] h-[500px] w-full max-md:hidden">
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

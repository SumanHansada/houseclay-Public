import { Suspense } from "react";

import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import MastheadDesktopClient from "@/components/MastheadDesktopClient";
import MastHeadMobileClient from "@/components/MastheadMobileClient";

import dummyData from "../data/dummyData.json";
import ClientPage from "./ClientPage";

export default async function Home() {
  const properties = dummyData.properties;
  const neighbourhoods = dummyData.neighbourhoods;
  const testimonials = dummyData.testimonials;

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

      {/* Advantages Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Advantages />
      </section>

      {/* Client-side interactive components */}
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPage
          properties={properties}
          neighbourhoods={neighbourhoods}
          testimonials={testimonials}
        />
      </Suspense>

      <Footer />
    </>
  );
}

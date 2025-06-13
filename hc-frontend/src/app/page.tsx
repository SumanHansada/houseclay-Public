import { headers } from "next/headers";
import { Suspense } from "react";

import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import MastheadDesktopClient from "@/components/MastheadDesktopClient";
import MastHeadMobileClient from "@/components/MastheadMobileClient";

import dummyData from "../data/dummyData.json";
import ClientPage from "./ClientPage";

// Server component to detect device type
async function getDeviceType() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  return { isMobile };
}

export default async function Home() {
  const { isMobile } = await getDeviceType();
  const properties = dummyData.properties;
  const neighbourhoods = dummyData.neighbourhoods;
  const testimonials = dummyData.testimonials;

  return (
    <>
      {/* Masthead Section - Server-side rendered based on device */}
      <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full">
        {isMobile ? <MastHeadMobileClient /> : <MastheadDesktopClient />}
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

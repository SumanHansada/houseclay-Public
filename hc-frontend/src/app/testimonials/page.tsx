"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Carousel2D from "@/components/Carousel2D";
// data
import TESTIMONIALS_DATA from "@/data/testimonials.json";
import { Footer, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";
import { ImageWithLoader } from "@/utility-components";

import { TestimonialCard } from "./components/TestimonialCard";

export default function TermsAndConditionsPage() {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [isMobile, dispatch]);

  return (
    <>
      <MobileHeader title="Success Stories & Testimonials" />
      {/* Desktop */}
      <main className="w-full h-full max-md:hidden md:block">
        <section className="relative w-full md:aspect-[15/4] md:block">
          <div className="absolute inset-0 hidden md:block">
            <ImageWithLoader
              src="/images/banner-testimonials.svg"
              alt="Banner Background"
              fill
              className="!object-contain object-center"
              sizes="(min-width:1536px) 1440px, 100vw"
              fetchPriority="high"
              priority
            />
          </div>
          <div className="absolute flex items-center pl-14 h-full xl:pl-40 w-1/4 lg:w-1/3 xl:w-2/5">
            <h1 className="font-bold text-gray-900 md:text-4xl xl:text-[44px]">
              Success Stories & Testimonials
            </h1>
          </div>
        </section>
        <h2 className="text-gray-900 text-lg xl:text-xl w-2/3 xl:w-2/5 mx-auto text-center py-16">
          Our users success stories reflect our commitment to delivering
          excellent service, transparency, and value.
        </h2>
        <section className="w-full xl:px-28 lg:px-14 md:px-14 px-8 py-8">
          <div className="lg:grid gap-x-8 gap-y-12 grid-cols-[repeat(auto-fill,minmax(380px,1fr))] hidden">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          <div className="lg:hidden">
            <Carousel2D
              slideWidth={400}
              gap={4}
              showDots={true}
              containerClassName=""
              className=""
              showArrows={true}
            >
              {TESTIMONIALS_DATA.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </Carousel2D>
          </div>
        </section>

        <div className="lg:flex w-full justify-center py-6 max-lg:hidden">
          <button className="rounded-xl px-5 py-3 border border-red-600 hover:bg-red-50">
            Load More
          </button>
        </div>

        <Footer />
      </main>

      {/* Mobile */}
      <main className="w-full h-full px-6 sm:px-8 md:hidden pt-[55px]">
        <section className="relative w-full aspect-[341/152]">
          <ImageWithLoader
            src="/images/banner-testimonials-mobile.svg"
            alt="Banner Background"
            fill
            className="!object-contain object-center"
            sizes="100vw"
            priority
          />
        </section>

        <h2 className="text-lg text-center text-gray-600 pt-6 pb-8 px-4 sm:px-6 text-pretty">
          Listing your property has never been easier or more effective.
          Here&apos;s why thousands of property owners trust us:
        </h2>

        <section className="mb-16 py-5">
          <Carousel2D
            slideWidth={380}
            gap={2}
            showDots
            containerClassName="md:hidden"
            className="md:hidden"
            showArrows
          >
            {TESTIMONIALS_DATA.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Carousel2D>
        </section>
      </main>
    </>
  );
}

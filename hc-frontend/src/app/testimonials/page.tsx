"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";
import Carousel2D from "@/components/Carousel2D";
// data
import TESTIMONIALS_DATA from "@/data/TestimonialsData.json";
import { Footer, MobileHeader } from "@/layout-components";
import { ImageWithLoader } from "@/utility-components";

import { TestimonialCard } from "./components/TestimonialCard";

export default function TestimonialsPage() {
  const router = useRouter();

  return (
    <>
      <MobileHeader>
        <MobileHeader.LeftAction>
          <Button
            variant="secondary"
            size="custom"
            className="rounded-full p-1"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
          </Button>
        </MobileHeader.LeftAction>
        <MobileHeader.Title>Success Stories & Testimonials</MobileHeader.Title>
      </MobileHeader>
      {/* Desktop */}
      <section className="w-full h-full max-md:hidden">
        <section
          className="relative w-full md:aspect-[15/4]"
          aria-labelledby="testimonials-hero-title"
        >
          <div className="absolute inset-0 max-md:hidden" aria-hidden="true">
            <ImageWithLoader
              src="/images/banner-testimonials.webp"
              alt=""
              fill
              className="object-center"
              sizes="100vw"
              fetchPriority="high"
              priority
            />
          </div>
          <div className="absolute flex items-center pl-14 h-full xl:pl-40 w-1/4 lg:w-1/3 xl:w-2/5">
            <h1
              id="testimonials-hero-title"
              className="font-bold text-gray-900 md:text-4xl xl:text-[44px]"
            >
              Success Stories &amp; Testimonials
            </h1>
          </div>
        </section>
        <h2 className="text-gray-600 text-lg xl:text-xl w-2/3 xl:w-2/5 mx-auto text-center py-16">
          Our users success stories reflect our commitment to delivering
          excellent service, transparency, and value.
        </h2>

        <section
          className="w-full xl:px-28 lg:px-14 md:px-14 px-8 py-8"
          aria-labelledby="testimonials-list-heading"
        >
          <h2 id="testimonials-list-heading" className="sr-only">
            Testimonials
          </h2>
          <div className="lg:grid gap-x-8 gap-y-12 grid-cols-[repeat(auto-fill,minmax(380px,1fr))] hidden">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <article
                key={testimonial.id}
                aria-label={`Testimonial by ${testimonial.name ?? "user"}`}
              >
                <TestimonialCard testimonial={testimonial} />
              </article>
            ))}
          </div>
          <div
            className="lg:hidden"
            aria-labelledby="testimonials-carousel-heading"
          >
            <h3 id="testimonials-carousel-heading" className="sr-only">
              Testimonials carousel
            </h3>
            <Carousel2D
              gap={4}
              showDots={false}
              containerClassName=""
              className=""
              showArrows
              responsiveSlidesPerView
            >
              {TESTIMONIALS_DATA.map((testimonial) => (
                <article
                  key={testimonial.id}
                  aria-label={`Testimonial by ${testimonial.name ?? "user"}`}
                >
                  <TestimonialCard testimonial={testimonial} />
                </article>
              ))}
            </Carousel2D>
          </div>
        </section>

        <div
          className="lg:flex w-full justify-center py-6 max-lg:hidden"
          aria-labelledby="testimonials-cta"
        >
          <h2 id="testimonials-cta" className="sr-only">
            More testimonials
          </h2>
          {/* <button className="rounded-xl px-6 py-2 border border-red-600 hover:bg-red-50">
            Load More
          </button> */}
        </div>

        <Footer />
      </section>

      {/* Mobile */}
      <section className="w-full h-full px-6 sm:px-8 md:hidden pt-[55px]">
        <section
          className="relative w-full aspect-[9/4]"
          aria-labelledby="mobile-hero-title"
        >
          <h1 id="mobile-hero-title" className="sr-only">
            Success Stories &amp; Testimonials
          </h1>
          <ImageWithLoader
            src="/images/banner-testimonials-mobile.webp"
            alt=""
            fill
            className="object-center"
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
            gap={2}
            showDots
            showArrows
            responsiveSlidesPerView
            containerClassName="md:hidden"
            className="md:hidden"
          >
            {TESTIMONIALS_DATA.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Carousel2D>
        </section>
      </section>
    </>
  );
}

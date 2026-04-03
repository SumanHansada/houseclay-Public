"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/base-components";
import { bannerAboutUsImageURL } from "@/common/cdnURLs";
import { Footer, MobileHeader } from "@/layout-components";
import { ImageWithLoader, SvgIcon } from "@/utility-components";

export default function AboutUsPage() {
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
        <MobileHeader.Title>About Us</MobileHeader.Title>
      </MobileHeader>
      <section className="w-full h-full">
        <div className="py-8 max-md:mb-16 md:py-12 xl:py-20 xl:px-28 lg:px-12 md:px-8">
          {/* HERO */}
          <section
            aria-labelledby="about-hero-title"
            className="relative w-full aspect-[15/7] min-h-[240px] md:min-h-[360px] xl:max-h-[620px]"
          >
            {/* Background image */}
            <div className="absolute inset-0" aria-hidden="true">
              <ImageWithLoader
                src={bannerAboutUsImageURL}
                alt="Banner About Us"
                fill
                className="object-center"
              />
            </div>

            {/* Centered heading */}
            <div
              className="
                absolute
                left-1/2 -translate-x-1/2
                top-2 sm:top-6 md:top-8 xl:top-10
                w-full max-w-5xl sm:px-4
                flex items-center justify-center
              "
            >
              <h1
                id="about-hero-title"
                className="font-bold text-center flex flex-col gap-1 md:gap-3"
              >
                <span className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] md:leading-tight">
                  Welcome to the future of
                </span>
                <span className="text-red-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] md:leading-tight">
                  Smart Living.
                </span>
              </h1>
            </div>
          </section>

          {/* MISSION */}
          <section
            aria-labelledby="mission-heading"
            className="space-y-3 mt-4 md:mt-6 lg:mt-10 xl:mt-16"
          >
            <p className="bg-red-500 px-5 py-2 md:px-7 md:py-3 text-white rounded-lg w-fit mx-auto sm:text-lg md:text-xl">
              OUR MISSION
            </p>
            <h2
              id="mission-heading"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-center lg:leading-normal xl:leading-normal md:w-4/5 mx-auto"
            >
              Houseclay makes renting{" "}
              <span className="text-red-500">simple</span>,{" "}
              <span className="text-red-500">fair</span>, and{" "}
              <span className="text-red-500">stress-free</span> by removing
              brokerage and enabling direct, pay-per-use connections between
              users.
            </h2>
          </section>

          {/* VALUES */}
          <section
            aria-labelledby="values-heading"
            className="relative bg-gray-50 w-full h-full rounded-lg py-8 sm:py-12 px-10 lg:px-20 mt-16 md:mt-14 lg:mt-16 xl:mt-28"
          >
            <h2 id="values-heading" className="sr-only">
              Our values
            </h2>
            {/* Centered tag */}
            <div
              className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2"
              aria-hidden="true"
            >
              <span className="bg-red-500 px-4 md:px-6 py-1 text-white rounded-lg w-fit text-sm md:text-lg">
                OUR VALUES
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:flex-nowrap gap-6 md:gap-10 xl:gap-12 2xl:justify-between">
              {/* Card 1 */}
              <article className="flex-1 basis-0 min-w-0 2xl:max-w-[420px]">
                <div className="h-full flex flex-col items-center text-center gap-4 sm:px-6 md:px-0 lg:px-6">
                  <SvgIcon iconSize="medium" name="transparency" size={110} />
                  <div className="space-y-2">
                    <h3 className="text-2xl lg:text-3xl font-semibold">
                      Transparency
                    </h3>
                    <p className="text-base lg:text-lg">
                      Clear, upfront, and honest — no hidden fees, no fake
                      listings, no brokerage in disguise.
                    </p>
                  </div>
                  <div className="mt-auto" />
                </div>
              </article>

              {/* Card 2 */}
              <article className="flex-1 basis-0 min-w-0 2xl:max-w-[420px]">
                <div className="h-full flex flex-col items-center text-center gap-4 sm:px-6 md:px-0 lg:px-6">
                  <SvgIcon iconSize="medium" name="fairness" size={110} />
                  <div className="space-y-2">
                    <h3 className="text-2xl lg:text-3xl font-semibold">
                      Fairness
                    </h3>
                    <p className="text-base lg:text-lg">
                      Tenants pay only for what they use, owners list freely — a
                      balanced, win-win marketplace.
                    </p>
                  </div>
                  <div className="mt-auto" />
                </div>
              </article>

              {/* Card 3 */}
              <article className="flex-1 basis-0 min-w-0 2xl:max-w-[420px]">
                <div className="h-full flex flex-col items-center text-center gap-4 sm:px-6 md:px-0 lg:px-6">
                  <SvgIcon iconSize="medium" name="simplicity" size={110} />
                  <div className="space-y-2">
                    <h3 className="text-2xl lg:text-3xl font-semibold">
                      Simplicity
                    </h3>
                    <p className="text-base lg:text-lg">
                      Renting should be stress-free. From discovery to move-in,
                      it&apos;s effortless and intuitive.
                    </p>
                  </div>
                  <div className="mt-auto" />
                </div>
              </article>
            </div>
          </section>

          {/* TEAM */}
          {/* <section className="mt-24">
            <h2 className="text-4xl font-bold w-fit mx-auto">Meet the Team</h2>
            <div></div>
          </section> */}

          {/* CTA */}
          <section
            aria-labelledby="cta-heading"
            className="mt-10 md:mt-16 lg:mt-24 w-11/12 lg:w-2/3 2xl:w-2/5 mx-auto text-center space-y-4"
          >
            <h2
              id="cta-heading"
              className="text-xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold"
            >
              We don&apos;t do subscription traps.
            </h2>
            <p className="text-gray-800 sm:tracking-wide sm:text-lg">
              Whether you&apos;re looking for a new place, trying to sell your
              property, or just browsing options — HouseClay is where trust
              meets tech.
            </p>
            <button
              type="button"
              onClick={() => router.push("/list-property")}
              className="bg-red-600 text-white px-7 py-2 rounded-lg hover:cursor-pointer hover:bg-red-600 text-lg"
            >
              List your property
            </button>
          </section>
        </div>

        <div className="max-md:hidden">
          <Footer />
        </div>
      </section>
    </>
  );
}

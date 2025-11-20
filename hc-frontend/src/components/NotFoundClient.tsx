"use client";

import Link from "next/link";

import { Footer } from "@/layout-components";
import { ImageWithLoader } from "@/utility-components";

export default function NotFoundClient() {
  return (
    <section className="flex flex-col w-full md:min-h-screen">
      <div className="w-full py-28 sm:py-12 flex flex-col flex-1 justify-center gap-2">
        <div className="relative w-11/12 sm:w-3/4 md:w-3/5 xl:w-1/2 aspect-[7/5] mx-auto">
          <ImageWithLoader
            src="/images/not-found.svg"
            alt="Banner Background"
            fill
            className="object-center"
            sizes="100vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-8 items-center justify-center max-md:px-5">
          <div className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl sm:tracking-wider font-inter text-center space-y-2 sm:space-y-4">
            <h1 className="font-bold sm:font-extrabold">
              Looks like this key doesn&apos;t fit.
            </h1>
            <h3>Let&apos;s get you back home.</h3>
          </div>

          <Link
            href="/"
            className="px-7 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-lg sm:text-xl text-white tracking-normal hover:cursor-pointer"
          >
            Go to Home
          </Link>
        </div>
      </div>

      {/* Footer sits at bottom */}
      <div className="max-md:hidden">
        <Footer />
      </div>
    </section>
  );
}

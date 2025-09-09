import Link from "next/link";

import { Footer } from "@/layout-components";
import { ImageWithLoader } from "@/utility-components";

export default function NotFound() {
  return (
    <main className="w-full">
      <div className="w-full py-28 sm:py-12">
        <div className="relative w-full px-6 sm:px-0 md:w-3/4 lg:w-2/3 h-[280px] sm:h-[380px] md:h-[450px] lg:h-[520px] mx-auto">
          <ImageWithLoader
            src="/images/not-found.svg"
            alt="Banner Background"
            fill
            className="!object-contain object-center"
            sizes="100vw"
            priority
          />
        </div>
        <div className="flex flex-col gap-8 items-center justify-center sm:pt-5 max-md:px-5">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl sm:tracking-wider font-inter text-center space-y-2 sm:space-y-4">
            <h1 className="font-bold sm:font-extrabold">
              Looks like this key doesn&apos;t fit.
            </h1>
            <h3 className="">Let&apos;s get you back home.</h3>
          </div>
          <Link
            href="/"
            className="px-7 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-lg sm:text-xl text-white hover:cursor-pointer tracking-normal"
          >
            Go to Home
          </Link>
        </div>
      </div>
      <div className="max-md:hidden">
        <Footer />
      </div>
    </main>
  );
}

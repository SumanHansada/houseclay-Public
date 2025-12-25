import { Footer } from "@/layout-components";
import { ImageWithLoader } from "@/utility-components";

import NotFoundContent from "./NotFoundContent";

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
          />
        </div>
        <NotFoundContent />
      </div>

      {/* Footer sits at bottom */}
      <div className="max-md:hidden">
        <Footer />
      </div>
    </section>
  );
}

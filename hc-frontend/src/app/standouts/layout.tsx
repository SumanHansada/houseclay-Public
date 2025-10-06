"use client";

import { Footer } from "@/layout-components";
import { ImageWithLoader, Tab, TabHeader, Tabs } from "@/utility-components";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function StandoutsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleTabChange = (tab: string) => {
    router.push(`/standouts/${tab}`);
  };

  return (
    <>
      <section className="w-full h-full max-md:hidden">
        <section
          className="relative w-full md:aspect-[15/4]"
          aria-labelledby="standouts-title"
        >
          <div className="absolute inset-0 max-md:hidden" aria-hidden="true">
            <ImageWithLoader
              src="/images/banner-standouts.svg"
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
              id="standouts-title"
              className="font-bold text-gray-900 md:text-4xl xl:text-[44px]"
            >
              Standouts
            </h1>
          </div>
        </section>

        <section className="flex-1 my-12">
          <div className="w-1/5 mx-auto">
            <Tabs
              defaultActive="rent"
              onTabChange={handleTabChange}
              className="mb-8"
            >
              <TabHeader
                containerClassName="border-b border-gray-200"
                tabsClassName="flex w-full"
              >
                <Tab
                  label="Rent"
                  value="rent"
                  containerClassName="w-1/2 py-3 font-medium"
                  activeClassName="text-red-500 border-b-2 border-red-500"
                  inactiveClassName="text-gray-500 hover:text-gray-700"
                />
                <Tab
                  label="Buy"
                  value="buy"
                  containerClassName="w-1/2 py-3 font-medium"
                  activeClassName="text-red-500 border-b-2 border-red-500"
                  inactiveClassName="text-gray-500 hover:text-gray-700"
                />
              </TabHeader>
            </Tabs>
          </div>
          <div className="xl:px-28 lg:px-14 md:px-14 px-6">{children}</div>
        </section>
      </section>

      <Footer />
    </>
  );
}

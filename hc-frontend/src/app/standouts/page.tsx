"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { BadgeType } from "@/common/enums";
import Properties from "@/components/Properties";
import { Footer } from "@/layout-components";
import { useStandoutsQuery } from "@/store/apiSlice";
import { ImageWithLoader } from "@/utility-components";

import GridSkeleton from "./GridSkeleton";

export default function StandoutsPage() {
  const router = useRouter();

  const {
    data: standoutsData,
    isLoading,
    isFetching,
    isError,
  } = useStandoutsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const standoutProperties = useMemo(
    () => standoutsData ?? [],
    [standoutsData],
  );

  // Loading State
  const noDataYet = standoutProperties.length === 0;
  const showSkeleton = isLoading || (isFetching && noDataYet);

  const handleCardClick = (e: React.MouseEvent, propertyID: string) => {
    e.stopPropagation();
    router.push(`/property-details/${propertyID}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Static Banner --- */}
      <section
        className="relative w-full md:aspect-[15/4] max-md:hidden"
        aria-labelledby="standouts-title"
      >
        <div className="absolute inset-0" aria-hidden="true">
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

      {/* --- Main Content --- */}
      <main className="flex-1 my-12 xl:px-28 lg:px-14 md:px-14 px-6">
        {isError ? (
          <div className="py-20 text-center">
            <p className="text-red-600">
              Unable to load properties. Please try again.
            </p>
          </div>
        ) : showSkeleton ? (
          // --- LOADING STATE: Renders Grid Skeleton ---
          <GridSkeleton cardCount={8} />
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
            {standoutProperties.map((property, idx) => (
              <Properties
                key={`${property.propertyID}-${idx}`}
                property={property}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                badgeType={(property as any).badgeType as BadgeType | undefined}
                onClick={(e: React.MouseEvent) =>
                  handleCardClick(e, property.propertyID)
                }
                showCarouselDots={false}
              />
            ))}

            {/* Handle empty data response */}
            {!isLoading && standoutProperties.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No standout properties found.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

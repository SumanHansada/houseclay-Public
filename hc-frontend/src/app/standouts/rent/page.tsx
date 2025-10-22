"use client";

import { useRouter } from "next/navigation";

import { BadgeType } from "@/common/enums";
import Properties from "@/components/Properties";
import { useStandoutsQuery } from "@/store/apiSlice";
import { useMemo } from "react";
import { PropertyCardWithImages } from "@/interfaces/User";
import { FALLBACK_IMG } from "@/common/constants";
import GridSkeleton from "../GridSkeleton";

export default function StandoutsRentPage() {
  const router = useRouter();

  const {
    data: standoutsData,
    isLoading,
    isFetching,
    isError,
  } = useStandoutsQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  // console.log("standoutsData", standoutsData);

  const standoutProperties = useMemo(
    () => standoutsData ?? [],
    [standoutsData],
  );

  const noDataYet = standoutProperties.length === 0;
  const showSkeleton = isLoading || (isFetching && noDataYet);

  const standoutPropertyCards: PropertyCardWithImages[] = useMemo(() => {
    return standoutProperties.map((prop: PropertyCardWithImages) => ({
      ...prop,
      images: prop.image ? [prop.image] : [FALLBACK_IMG],
    }));
  }, [standoutProperties]);

  console.log("Standout Property cards: ", standoutPropertyCards);

  const handleCardClick = (e: React.MouseEvent, propertyID: string) => {
    e.stopPropagation();
    router.push(`/property-details/${propertyID}`);
  };

  if (isError) {
    return (
      <div className="px-6 md:px-14 lg:px-14 xl:px-28 py-8">
        <p className="text-sm text-red-600">
          Could not load standouts. Please retry.
        </p>
      </div>
    );
  }

  if (showSkeleton) {
    return <GridSkeleton cardCount={8} />;
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
      {standoutPropertyCards.map((property, idx) => (
        <Properties
          key={`${property.propertyID}-${idx}`}
          property={property}
          badgeType={
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (property as any).badgeType as BadgeType | undefined
          }
          onClick={(e: React.MouseEvent) =>
            handleCardClick(e, property.propertyID)
          }
          showCarouselDots={false}
        />
      ))}
    </div>
  );
}

"use client";

import { BadgeType } from "@/common/enums";
import Properties from "@/components/Properties";
import { useRouter } from "next/navigation";

import PropertiesData from "@/data/PropertiesData.json";

export default function StandoutsRentPage() {
  const router = useRouter();
  const standoutProperties = PropertiesData.properties;

  const handleCardClick = (e: React.MouseEvent, propertyID: string) => {
    e.stopPropagation();
    router.push(`/property-details/${propertyID}`);
  };

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
      {standoutProperties.map((property, idx) => (
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

"use client";

import { useMemo } from "react";

import { formatDate, getDateKey } from "@/common/utils";
import { UserOwnedProperties } from "@/interfaces/User";

import { PropertyCard } from "./PropertyCard";

interface GroupedProperties {
  date: string;
  properties: UserOwnedProperties[];
}

export function PropertyCardList({
  items,
  onDashboard,
  onOpenDialog,
  onMarkAsRented,
}: {
  items: UserOwnedProperties[];
  onDashboard: (propertyCategory: string, propertyId: string) => void;
  onOpenDialog: (
    propertyCategory: string,
    propertyId: string,
    propertyState: string,
  ) => void;
  onMarkAsRented?: (propertyId: string) => void;
}) {
  // backend guarantees items are already sorted
  const groupedProperties = useMemo<GroupedProperties[]>(() => {
    const groups: GroupedProperties[] = [];
    if (!items || items.length === 0) return groups;

    let currentKey = "";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = getDateKey(item.updatedOn);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({
          date: formatDate(item.updatedOn),
          properties: [item],
        });
      } else {
        groups[groups.length - 1].properties.push(item);
      }
    }
    return groups;
  }, [items]);

  return (
    <div className="space-y-8">
      {groupedProperties.map((group) => (
        <div key={group.date} className="space-y-4">
          <h2 className="pb-2 text-base font-semibold text-gray-800 border-b border-gray-200 md:text-lg">
            {group.date}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {group.properties.map((property) => (
              <PropertyCard
                key={property.propertyID}
                property={property}
                onDashboard={onDashboard}
                onOpenDialog={onOpenDialog}
                onMarkAsRented={onMarkAsRented}
              />
            ))}
          </div>
        </div>
      ))}
      {groupedProperties.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No properties found
        </div>
      )}
    </div>
  );
}

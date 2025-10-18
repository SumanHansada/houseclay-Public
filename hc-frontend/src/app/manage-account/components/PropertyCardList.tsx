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
  onMarkSold,
  onOpenDialog,
}: {
  items: UserOwnedProperties[];
  onDashboard: (propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
  onOpenDialog: (propertyId: string) => void;
}) {
  // backend guarantees items are already sorted
  const groupedProperties = useMemo<GroupedProperties[]>(() => {
    const groups: GroupedProperties[] = [];
    if (!items || items.length === 0) return groups;

    let currentKey = "";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = getDateKey(item.createdOn);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({
          date: formatDate(item.createdOn),
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
          <h2 className="text-base md:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {group.date}
          </h2>
          <div className="grid gap-4 grid-cols-1">
            {group.properties.map((property) => (
              <PropertyCard
                key={property.propertyID}
                property={property}
                onDashboard={onDashboard}
                onMarkSold={onMarkSold}
                onOpenDialog={onOpenDialog}
              />
            ))}
          </div>
        </div>
      ))}
      {groupedProperties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found
        </div>
      )}
    </div>
  );
}

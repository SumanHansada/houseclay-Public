"use client";

import { useMemo } from "react";

import { UserOwnedProperties } from "@/interfaces/User";

import { formatDate, getDateKey } from "../utils";
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
  const groupedProperties = useMemo(() => {
    // Group properties by date
    const grouped = items.reduce(
      (acc, property) => {
        const dateKey = getDateKey(property.createdOn);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(property);
        return acc;
      },
      {} as Record<string, UserOwnedProperties[]>,
    );

    // Convert to array and sort by date (newest first)
    const groupedArray: GroupedProperties[] = Object.entries(grouped)
      .map(([_, properties]) => ({
        date: formatDate(properties[0].createdOn),
        properties: properties.sort(
          (a, b) =>
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
        ),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.properties[0].createdOn);
        const dateB = new Date(b.properties[0].createdOn);
        return dateB.getTime() - dateA.getTime();
      });

    return groupedArray;
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

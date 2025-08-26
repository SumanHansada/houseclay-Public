"use client";

import { useMemo } from "react";
import { PropertyCard } from "./PropertyCard";
import { PropertyCategory } from "@/common/enums";

export interface Property {
  propertyID: string;
  propertyName: string;
  category: PropertyCategory;
  listedOn: string;
  builtupArea: number;
  price: number | null;
  rent: number | null;
  status: string;
}

interface GroupedProperties {
  date: string;
  properties: Property[];
}

// Helper function to format date from ISO string to DD-MMM-YYYY
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to get date only (YYYY-MM-DD) for grouping
const getDateKey = (isoString: string): string => {
  return new Date(isoString).toISOString().split("T")[0];
};

export function PropertyCardList({
  items,
  onDashboard,
  onMarkSold,
  onOpenDialog,
}: {
  items: Property[];
  onDashboard: (propertyId: string) => void;
  onMarkSold: (propertyId: string) => void;
  onOpenDialog: (propertyId: string) => void;
}) {
  const groupedProperties = useMemo(() => {
    // Group properties by date
    const grouped = items.reduce(
      (acc, property) => {
        const dateKey = getDateKey(property.listedOn);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(property);
        return acc;
      },
      {} as Record<string, Property[]>,
    );

    // Convert to array and sort by date (newest first)
    const groupedArray: GroupedProperties[] = Object.entries(grouped)
      .map(([dateKey, properties]) => ({
        date: formatDate(properties[0].listedOn), // Use first property's date for display
        properties: properties.sort(
          (a, b) =>
            new Date(b.listedOn).getTime() - new Date(a.listedOn).getTime(),
        ),
      }))
      .sort((a, b) => {
        // Sort groups by date (newest first)
        const dateA = new Date(a.properties[0].listedOn);
        const dateB = new Date(b.properties[0].listedOn);
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
                {...property}
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

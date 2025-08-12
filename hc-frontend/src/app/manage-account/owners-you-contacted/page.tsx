"use client";

import { useMemo, useState } from "react";
import { PropertyCategory } from "@/common/enums";
import { Check } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { DUMMY_PROPERTIES } from "../dummy";

const FILTERS = [
  { key: PropertyCategory.NONE, label: "All" },
  { key: PropertyCategory.RESALE, label: "Resale" },
  { key: PropertyCategory.RENT, label: "Rent" },
  { key: PropertyCategory.FLATMATE, label: "Flatmate" },
];

export default function OwnersContactedPage() {
  const [selected, setSelected] = useState<PropertyCategory>(
    PropertyCategory.NONE,
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = useMemo(() => {
    return DUMMY_PROPERTIES.filter((p) => {
      // Just to make dummy data look more realistic
      if (p.contacted === true) return false;
      if (selected !== PropertyCategory.NONE && p.category !== selected)
        return false;
      if (onlyAvailable && !p.available) return false;
      return true;
    });
  }, [selected, onlyAvailable]);

  return (
    <main>
      {/* Header */}
      <div className="border-b-2 pb-2 mb-8 flex justify-between">
        <h1 className="text-2xl font-medium">Contacted Properties</h1>
        <button
          type="button"
          aria-pressed={onlyAvailable}
          onClick={() => setOnlyAvailable((v) => !v)}
          className="inline-flex items-center gap-2"
        >
          {/* Red squared checkbox */}
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-sm border border-red-500 ${
              onlyAvailable
                ? "bg-red-500 text-white"
                : "bg-transparent text-transparent"
            }`}
          >
            <Check className="h-4 w-4" />
          </span>
          <span className="text-lg text-gray-700">Currently Available</span>
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3 text-lg font-medium text-gray-700 mb-8 overflow-x-auto">
        {FILTERS.map((f) => {
          const active = selected === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setSelected(f.key)}
              aria-pressed={active}
              className={`px-4 py-2 rounded-lg border shadow-sm whitespace-nowrap ${
                active ? "bg-red-500 text-white border-red-500" : "bg-white"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onContact={(id) => console.log("contact", id)}
            onFavoriteToggle={(id, next) => console.log("favorite", id, next)}
          />
        ))}
      </div>
    </main>
  );
}

"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";

import { PropertyCategory } from "@/common/enums";

import { PropertyTable } from "../components/PropertiesTable";
import { MY_DUMMY_PROPERTIES } from "../dummy";

const FILTERS = [
  { key: PropertyCategory.NONE, label: "All" },
  { key: PropertyCategory.RESALE, label: "Resale" },
  { key: PropertyCategory.RENT, label: "Rent" },
  { key: PropertyCategory.FLATMATE, label: "Flatmate" },
];

export default function MyPropertiesPage() {
  const [selected, setSelected] = useState<PropertyCategory>(
    PropertyCategory.NONE,
  );
  const [onlyActive, setOnlyActive] = useState(false);

  const filtered = useMemo(() => {
    return MY_DUMMY_PROPERTIES.filter((p) => {
      if (selected !== PropertyCategory.NONE && p.category !== selected)
        return false;
      if (onlyActive && p.status === "Inactive") return false;
      return true;
    });
  }, [selected, onlyActive]);

  return (
    <main>
      {/* Header */}
      <div className="border-b-2 pb-2 mb-8 flex justify-between">
        <h1 className="text-2xl font-medium">My Properties</h1>
        <button
          type="button"
          aria-pressed={onlyActive}
          onClick={() => setOnlyActive((v) => !v)}
          className="inline-flex items-center gap-2"
        >
          {/* Red squared checkbox */}
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-sm border border-red-500 ${
              onlyActive
                ? "bg-red-500 text-white"
                : "bg-transparent text-transparent"
            }`}
          >
            <Check className="h-4 w-4" />
          </span>
          <span className="text-lg text-gray-700">Only Active</span>
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

      <div className="space-y-4">
        <PropertyTable properties={filtered} />
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { PropertyCategory } from "@/common/enums";
import { Check, ChevronLeft } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { DUMMY_PROPERTIES } from "../dummy";
import { useRouter } from "next/navigation";

const filterOptions = [
  { label: "All", value: PropertyCategory.NONE },
  { label: "Resale", value: PropertyCategory.RESALE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

export default function ShortlistsPage() {
  const [selected, setSelected] = useState<PropertyCategory>(
    PropertyCategory.NONE,
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const router = useRouter();

  const filtered = useMemo(() => {
    return DUMMY_PROPERTIES.filter((p) => {
      if (selected !== PropertyCategory.NONE && p.category !== selected)
        return false;
      if (onlyAvailable && !p.available) return false;
      return true;
    });
  }, [selected, onlyAvailable]);

  return (
    <main>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <header className="border-b-2 pb-2 mb-8 flex justify-between">
          <h1 className="text-2xl font-medium">Shortlisted Properties</h1>
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
        </header>

        {/* Filter buttons */}
        <div className="flex gap-3 text-lg font-medium text-gray-700 mb-4">
          {filterOptions.map((f) => {
            const active = selected === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelected(f.value)}
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
      </section>

      {/* Mobile */}
      <section className="md:hidden overflow-y-auto">
        {/* Header */}
        <header className="fixed top-0 inset-x-0 z-50 h-[55px] border-b border-gray-200 bg-white">
          <div className="grid grid-cols-5 items-center h-full px-4">
            <button
              aria-label="Go back"
              className="rounded-full size-10 border flex items-center justify-center col-span-1"
              onClick={() => router.back()}
            >
              <ChevronLeft size={25} />
            </button>

            <h1 className="col-span-3 text-center font-medium">
              Shortlisted Properties
            </h1>
          </div>
        </header>

        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 rounded-lg mx-8">
          {filterOptions.map((f) => {
            const active = selected === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelected(f.value)}
                aria-pressed={active}
                className={`px-2 py-1 sm:px-4 sm:py-2 shadow-sm whitespace-nowrap ${
                  active ? "border border-red-500 text-red-500 rounded-lg" : ""
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cards */}
      <div className="space-y-4 overflow-y-auto px-8">
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

"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { BadgeType, PropertyCategory, PropertyStatus } from "@/common/enums";
import Properties from "@/components/Properties";
import { RootState } from "@/store/store";

import Loading from "./loading";

const filterOptions = [
  { label: "All", value: PropertyCategory.NONE },
  // { label: "Resale", value: PropertyCategory.RESALE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

export default function ShortlistsPage() {
  const router = useRouter();

  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<PropertyCategory>(PropertyCategory.NONE);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { shortlistedProperties } = useSelector(
    (state: RootState) => state.shortlist,
  );
  const { userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );

  const filteredProperties = useMemo(() => {
    return shortlistedProperties.filter((prop) => {
      if (
        selectedFilterCategory !== PropertyCategory.NONE &&
        prop.propertyCategory !== selectedFilterCategory
      )
        return false;
      if (onlyAvailable && prop.propertyState !== PropertyStatus.VERIFIED)
        return false;
      return true;
    });
  }, [shortlistedProperties, selectedFilterCategory, onlyAvailable]);

  const handleCardClick = (e: React.MouseEvent, propertyID: string) => {
    e.stopPropagation();
    router.push(`/property-details/${propertyID}`);
  };

  if (userDetailLoading || userDetailError) {
    return <Loading />;
  }

  return (
    <section>
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
            const active = selectedFilterCategory === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFilterCategory(f.value)}
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
      <section className="md:hidden">
        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-8">
          {filterOptions.map((f) => {
            const active = selectedFilterCategory === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFilterCategory(f.value)}
                aria-pressed={active}
                className={`px-2 py-1 sm:px-4 sm:py-2 flex-1 whitespace-nowrap ${
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
      <div className="space-y-4 overflow-y-auto max-md:px-6 pt-4 pb-16">
        {/* Property List */}
        <div className="mx-auto w-full py-5">
          {filteredProperties.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No properties found.
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
              {filteredProperties.map((property, idx) => (
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
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BadgeType, PropertyCategory } from "@/common/enums";
import Properties from "@/components/Properties";
import { MobileHeader } from "@/layout-components";

import {
  DUMMY_PROPERTIES_FOR_PROPERTY_CARD,
  PropertyCardDummy,
} from "../dummy";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDispatch } from "react-redux";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";

const filterOptions = [
  { label: "All", value: PropertyCategory.NONE },
  { label: "Resale", value: PropertyCategory.RESALE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

export default function OwnersContactedPage() {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<PropertyCategory>(
    PropertyCategory.NONE,
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const router = useRouter();

  const filtered: PropertyCardDummy[] = useMemo(() => {
    return DUMMY_PROPERTIES_FOR_PROPERTY_CARD.filter((p) => {
      if (selected !== PropertyCategory.NONE && p.category !== selected)
        return false;
      if (onlyAvailable) return false;
      return true;
    });
  }, [selected, onlyAvailable]);

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
      dispatch(setHideStickyNavBar(false));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
      dispatch(setHideStickyNavBar(true));
    }
  }, [isMobile, dispatch]);

  const handleCardClick = (e: React.MouseEvent, propertyID: string) => {
    e.stopPropagation();
    router.push(`/property-details/${propertyID}`);
  };

  return (
    <main>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <header className="border-b-2 pb-2 mb-8 flex justify-between">
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
      <section className="md:hidden">
        {/* Header */}
        <MobileHeader title="Owners you contacted" />

        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-8">
          {filterOptions.map((f) => {
            const active = selected === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelected(f.value)}
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
      <div className="space-y-4 overflow-y-auto px-4 sm:px-8 max-md:px-8 max-md:mb-16">
        {/* Property List */}
        <div className="mx-auto w-full py-5">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No properties found.
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
              {filtered.map((property, idx) => (
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
    </main>
  );
}

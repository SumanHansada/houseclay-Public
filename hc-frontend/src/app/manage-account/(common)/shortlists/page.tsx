"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { BadgeType, PropertyCategory, PropertyStatus } from "@/common/enums";
import Properties from "@/components/Properties";
import { RootState } from "@/store/store";
import { Tab, TabHeader, Tabs } from "@/utility-components/Tabs";

import Loading from "./loading";

const filterOptions = [
  { label: "All", value: PropertyCategory.NONE },
  // { label: "Resale", value: PropertyCategory.RESALE },
  { label: "Rent", value: PropertyCategory.RENT },
  { label: "Flatmate", value: PropertyCategory.FLATMATE },
];

const listCrossfade = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1] as const,
};

export default function ShortlistsPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

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

  /** Drives list crossfade when filter / availability changes (not on unrelated shortlist updates). */
  const listPresenceKey = `${selectedFilterCategory}-${onlyAvailable}`;

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
        <div className="m-3 mx-4">
          <Tabs
            active={selectedFilterCategory}
            onTabChange={(value) =>
              setSelectedFilterCategory(value as PropertyCategory)
            }
          >
            <TabHeader
              segmented
              tabsClassName="w-full rounded-xl border border-gray-200 bg-gray-50/80 p-1.5 text-lg sm:p-2"
            >
              {filterOptions.map((f) => (
                <Tab
                  key={f.value}
                  label={f.label}
                  value={f.value}
                  containerClassName="px-2 py-1 sm:px-4 sm:py-2 text-sm font-medium sm:text-base max-md:font-normal"
                  activeClassName="text-red-500"
                  inactiveClassName="text-gray-800"
                />
              ))}
            </TabHeader>
          </Tabs>
        </div>
      </section>

      {/* Cards — stacked grid + AnimatePresence keeps exit/enter overlapped (no vertical jump during crossfade) */}
      <div className="space-y-4 overflow-y-auto max-md:px-4 pt-4 pb-16">
        <div className="mx-auto grid w-full [grid-template-areas:'stack']">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={listPresenceKey}
              className="[grid-area:stack] w-full min-w-0"
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: reduceMotion ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : listCrossfade}
            >
              {filteredProperties.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  No properties found.
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-4">
                  {filteredProperties.map((property) => (
                    <Properties
                      key={property.propertyID}
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

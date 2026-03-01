"use client";

import { lazy, Suspense, useEffect, useMemo } from "react";

import { useDialog } from "@/providers/DialogContextProvider";
import {
  useLazyPopularNeighbourhoodsQuery,
  useLazyStandoutsQuery,
} from "@/store/apiSlice";

// Lazy load components
const Advantages = lazy(() => import("@/components/Advantages"));
const Neighbourhoods = lazy(() => import("@/components/Neighborhoods"));
const PropertyOwners = lazy(() => import("@/components/PropertyOwners"));
const Standouts = lazy(() => import("@/components/Standouts"));
const Testimonials = lazy(() =>
  import("@/components/Testimonials").then((m) => ({
    default: m.Testimonials,
  })),
);
const StandoutsDialog = lazy(() =>
  import("@/dialogs").then((m) => ({ default: m.StandoutsDialog })),
);

import { STANDOUTS_DIALOG_ID } from "@/common/dataConstants/dialogIDs";
import TESTIMONIALS_DATA from "@/data/TestimonialsData.json";

// Simple fallback component
const SectionFallback = () => (
  <div className="min-h-[500px] w-full animate-pulse" />
);

export default function ClientPage() {
  const { isDialogOpen, closeDialog } = useDialog();

  const [getPopularNeighbourhoods, { data: neighbourhoodData }] =
    useLazyPopularNeighbourhoodsQuery();
  const [getStandouts, { data: standoutsData }] = useLazyStandoutsQuery();

  useEffect(() => {
    const triggerQueries = () => {
      getPopularNeighbourhoods(undefined);
      getStandouts(undefined);
    };

    if (document.readyState === "complete") {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(triggerQueries, { timeout: 2000 });
      } else {
        setTimeout(triggerQueries, 0);
      }
    } else {
      const handleLoad = () => {
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(triggerQueries, { timeout: 2000 });
        } else {
          setTimeout(triggerQueries, 0);
        }
      };
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [getPopularNeighbourhoods, getStandouts]);

  const standoutProperties = useMemo(
    () => standoutsData ?? [],
    [standoutsData],
  );

  useEffect(() => {
    if (isDialogOpen(STANDOUTS_DIALOG_ID) && standoutProperties.length < 1) {
      closeDialog(STANDOUTS_DIALOG_ID);
    }
  }, [standoutProperties.length, isDialogOpen, closeDialog]);

  return (
    <>
      {/* Advantages Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Suspense fallback={<SectionFallback />}>
          <Advantages />
        </Suspense>
      </section>

      {/* Standouts Section */}
      {standoutProperties.length > 3 ? (
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <Suspense fallback={<SectionFallback />}>
            <Standouts properties={standoutProperties} />
          </Suspense>
        </section>
      ) : null}

      {/* neighbourhoods Section */}
      {neighbourhoodData && neighbourhoodData.length > 3 ? (
        <section className="min-h-[500px] w-full overflow-hidden">
          <Suspense fallback={<SectionFallback />}>
            <Neighbourhoods neighbourhoods={neighbourhoodData} />
          </Suspense>
        </section>
      ) : null}

      {/* Testimonials Section */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Suspense fallback={<SectionFallback />}>
          <Testimonials testimonials={TESTIMONIALS_DATA} />
        </Suspense>
      </section>

      {/* Property Owners Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Suspense fallback={<SectionFallback />}>
          <PropertyOwners />
        </Suspense>
      </section>

      {/* Standouts Dialog */}
      {isDialogOpen(STANDOUTS_DIALOG_ID) && standoutProperties.length > 0 && (
        <Suspense fallback={null}>
          <StandoutsDialog
            id={STANDOUTS_DIALOG_ID}
            properties={standoutProperties}
          />
        </Suspense>
      )}
    </>
  );
}

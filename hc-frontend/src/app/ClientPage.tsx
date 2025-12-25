"use client";

import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import Advantages from "@/components/Advantages";
import Neighbourhoods from "@/components/Neighborhoods";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import { Testimonials } from "@/components/Testimonials";
import { StandoutsDialog } from "@/dialogs";
import { Testimonial } from "@/interfaces/Testimonial";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useLazyPopularNeighbourhoodsQuery,
  useLazyStandoutsQuery,
} from "@/store/apiSlice";

interface ClientPageProps {
  testimonials: Testimonial[];
}

export default function ClientPage({ testimonials }: ClientPageProps) {
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
    if (isDialogOpen("standouts-dialog") && standoutProperties.length < 1) {
      closeDialog("standouts-dialog");
      toast.error(
        "Currently there are no Standouts Properties. Please check again later!",
        { id: "standouts-empty" },
      );
    }
  }, [standoutProperties.length, isDialogOpen, closeDialog]);

  return (
    <>
      {/* Advantages Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Advantages />
      </section>

      {/* Standouts Section */}
      {standoutProperties.length > 3 ? (
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <Standouts properties={standoutProperties} />
        </section>
      ) : null}

      {/* neighbourhoods Section */}
      {neighbourhoodData && neighbourhoodData.length > 3 ? (
        <section className="min-h-[500px] w-full overflow-hidden">
          <Neighbourhoods neighbourhoods={neighbourhoodData} />
        </section>
      ) : null}

      {/* Testimonials Section */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Testimonials testimonials={testimonials} />
      </section>

      {/* Property Owners Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <PropertyOwners />
      </section>

      {/* Standouts Dialog */}
      {isDialogOpen("standouts-dialog") && standoutProperties.length > 0 && (
        <StandoutsDialog
          id="standouts-dialog"
          properties={standoutProperties}
        />
      )}
    </>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { FALLBACK_IMG } from "@/common/constants";
import Advantages from "@/components/Advantages";
import Neighbourhoods from "@/components/Neighborhoods";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import { Testimonials } from "@/components/Testimonials";
import { StandoutsDialog } from "@/dialogs";
import { Testimonial } from "@/interfaces/Testimonial";
import { PropertyCardWithImages } from "@/interfaces/User";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  usePopularNeighbourhoodsQuery,
  useStandoutsQuery,
} from "@/store/apiSlice";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";

interface ClientPageProps {
  testimonials: Testimonial[];
}

export default function ClientPage({ testimonials }: ClientPageProps) {
  const { isDialogOpen, closeDialog } = useDialog();
  const dispatch = useDispatch();

  const { data: neighbourhoodData } = usePopularNeighbourhoodsQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  // console.log("neighbourhoodData", neighbourhoodData);

  const { data: standoutsData } = useStandoutsQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  // console.log("standoutsData", standoutsData);

  const standoutProperties = useMemo(
    () => standoutsData ?? [],
    [standoutsData],
  );

  const standoutPropertyCards: PropertyCardWithImages[] = useMemo(() => {
    return standoutProperties.map((prop: PropertyCardWithImages) => ({
      ...prop,
      images: prop.image ? [prop.image] : [FALLBACK_IMG],
    }));
  }, [standoutProperties]);

  useEffect(() => {
    if (
      isDialogOpen("standouts-dialog") &&
      standoutPropertyCards.length === 0
    ) {
      closeDialog("standouts-dialog");
      toast.error(
        "Currently there are no Standouts Properties. Please check again later!",
        { id: "standouts-empty" },
      );
    }
  }, [standoutPropertyCards.length, isDialogOpen, closeDialog]);

  // Initialize app state
  useEffect(() => {
    dispatch(setHideHeader(false));
    dispatch(setHideFooter(false));
    dispatch(setHideStickyNavBar(false));
  }, [dispatch]);

  return (
    <>
      {/* Advantages Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Advantages />
      </section>

      {/* Standouts Section */}
      {standoutPropertyCards.length > 3 ? (
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <Standouts properties={standoutPropertyCards} />
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
      {isDialogOpen("standouts-dialog") && standoutPropertyCards.length > 0 && (
        <StandoutsDialog
          id="standouts-dialog"
          properties={standoutPropertyCards}
        />
      )}
    </>
  );
}

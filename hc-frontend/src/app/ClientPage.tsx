"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Advantages from "@/components/Advantages";
import Neighbourhoods from "@/components/Neighborhoods";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import { Testimonials } from "@/components/Testimonials";
import { LoginDialog, MenuDialog, StandoutsDialog } from "@/dialogs";
import { Neighbourhood } from "@/interfaces/Neighbourhood";
import { PropertySearch } from "@/interfaces/PropertySearch";
import { Testimonial } from "@/interfaces/Testimonial";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import { usePopularNeighbourhoodsQuery } from "@/store/apiSlice";

interface ClientPageProps {
  properties: PropertySearch[];
  neighbourhoods: Neighbourhood[];
  testimonials: Testimonial[];
}

export default function ClientPage({
  properties,
  neighbourhoods,
  testimonials,
}: ClientPageProps) {
  const { isDialogOpen } = useDialog();
  const dispatch = useDispatch();

  const { data } = usePopularNeighbourhoodsQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  console.log(data);

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
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Standouts properties={properties} />
      </section>

      {/* neighbourhoods Section */}

      <section className="min-h-[500px] w-full overflow-hidden">
        <Neighbourhoods neighbourhoods={neighbourhoods} />
      </section>

      {/* Testimonials Section */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Testimonials testimonials={testimonials} />
      </section>

      {/* Property Owners Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <PropertyOwners />
      </section>

      {/* Standouts Dialog */}
      {isDialogOpen("standouts-dialog") && (
        <StandoutsDialog id="standouts-dialog" properties={properties} />
      )}

      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && <LoginDialog id="login-dialog" />}

      {/* Menu Dialog */}
      {isDialogOpen("menu-dialog") && <MenuDialog id="menu-dialog" />}
    </>
  );
}

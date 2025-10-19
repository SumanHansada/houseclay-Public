"use client";

import { useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("rent");

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
        <Standouts
          listingType={activeTab}
          properties={properties}
          setActiveTab={setActiveTab}
        />
      </section>

      {/* neighbourhoods Section */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Neighbourhoods
          listingType={activeTab}
          neighbourhoods={neighbourhoods}
        />
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
        <StandoutsDialog
          id="standouts-dialog"
          activeTab={activeTab}
          properties={properties}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && <LoginDialog id="login-dialog" />}

      {/* Menu Dialog */}
      {isDialogOpen("menu-dialog") && <MenuDialog id="menu-dialog" />}
    </>
  );
}

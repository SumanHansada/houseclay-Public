"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Neighbourhoods from "@/components/Neighborhoods";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import { Testimonials } from "@/components/Testimonials";
import { Neighbourhood } from "@/interfaces/Neighbourhood";
import { Property } from "@/interfaces/Property";
import { Testimonial } from "@/interfaces/Testimonial";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";

interface ClientPageProps {
  properties: Property[];
  neighbourhoods: Neighbourhood[];
  testimonials: Testimonial[];
}

export default function ClientPage({
  properties,
  neighbourhoods,
  testimonials,
}: ClientPageProps) {
  const [activeTab, setActiveTab] = useState("rent");
  const { isDialogOpen, closeDialog } = useDialog();
  const dispatch = useDispatch();

  // Initialize app state
  useEffect(() => {
    dispatch(setHideHeader(false));
    dispatch(setHideFooter(false));
    dispatch(setHideStickyNavBar(false));
  }, [dispatch]);

  return (
    <>
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
        <Dialog
          id="standouts-dialog"
          type="bottom-sheet"
          onClose={() => {
            closeDialog("standouts-dialog");
            dispatch(setHideStickyNavBar(false));
          }}
          entryAnimation="animate-slide-in-bottom"
          exitAnimation="animate-slide-out-bottom"
        >
          <DialogHeader>
            <div className="py-2 px-8 flex flex-col justify-between items-center w-full">
              <h1 className="text-xl mt-1 mb-2 text-black">Standouts</h1>
            </div>
            <button className="absolute top-4 right-4 border border-gray-200 rounded-full">
              <X
                onClick={() => {
                  closeDialog("standouts-dialog");
                  dispatch(setHideStickyNavBar(false));
                }}
                size={25}
              />
            </button>
          </DialogHeader>
          <DialogContent>
            <Standouts
              listingType={activeTab}
              properties={properties}
              setActiveTab={setActiveTab}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

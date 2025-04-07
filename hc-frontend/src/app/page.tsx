"use client";
import { X } from "lucide-react";
import { useState } from "react";

import Advantages from "@/components/Advantages";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import MastHeadDesktop from "@/components/MastheadDesktop";
import MastHeadMobile from "@/components/MastheadMobile";
import Neighbourhoods from "@/components/Neighborhoods";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import { Testimonials } from "@/components/Testimonials";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

import dummyData from "../data/dummyData.json";

export default function Home() {
  const [activeTab, setActiveTab] = useState("rent");
  const properties = dummyData.properties;
  const neighbourhoods = dummyData.neighbourhoods;
  const testimonials = dummyData.testimonials;
  const { isDialogOpen, closeDialog } = useDialog();
  const { isMobile } = useDeviceContext();
  return (
    <>
      {/* Masthead Desktop Section */}
      <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full overflow-hidden max-md:hidden">
        <MastHeadDesktop activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>
      {/* Masthead Mobile Section */}
      <section className={"min-h-[500px] w-full overflow-hidden md:hidden"}>
        <MastHeadMobile activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>
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
        <Dialog
          id="standouts-dialog"
          type="bottom-sheet"
          onClose={() => closeDialog("standouts-dialog")}
          height={80}
          entryAnimation="animate-slide-in-bottom"
          exitAnimation="animate-slide-out-bottom"
        >
          {isMobile && (
            <DialogHeader>
              <div className="py-2 px-8 flex flex-col justify-between items-center w-full">
                <h1 className="text-xl mt-1 mb-2 text-black">Standouts</h1>
              </div>
              <button className="absolute top-4 right-4 border border-gray-200 rounded-full">
                <X onClick={() => closeDialog("standouts-dialog")} size={25} />
              </button>
            </DialogHeader>
          )}
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

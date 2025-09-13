"use client";

import { Loader2 } from "lucide-react";
import React from "react";

import { ImageWithLoader } from "@/utility-components";

const EditPropertyLoading = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 border-b h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden">
        <div className="flex justify-center items-center align-middle w-full md:hidden">
          <h1 className="text-lg my-auto text-black ml-auto">Edit Property</h1>
        </div>
      </section>

      {/* Mobile Content */}
      <section className="w-full my-0 min-h-[calc(100svh-55px)] flex-col container pt-4 pb-2 px-6 mx-auto flex justify-between gap-16 md:hidden">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-gray-600">Loading edit property form...</p>
        </div>
      </section>

      {/* Desktop Content */}
      <section className="xl:min-h-[500px] min-h-[400px] max-md:min-h-[fit-content] w-full overflow-hidden max-md:hidden">
        <div className="container py-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8 flex justify-between gap-16">
          <div className="flex w-2/5 justify-around items-start">
            <ImageWithLoader
              src={"/images/list-your-property.webp"}
              alt="Edit Your Property"
              width={550}
              height={475}
              className="my-0"
            />
          </div>
          <div className="flex w-3/5 justify-end items-start">
            <div className="max-w-lg xl:max-w-xl lg:w-full my-0 flex flex-col gap-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                <p className="text-gray-600">Loading edit property form...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditPropertyLoading;

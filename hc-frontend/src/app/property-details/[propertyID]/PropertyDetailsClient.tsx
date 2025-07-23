"use client";

import { pascalCase } from "@/common/utils";
import PhotoGallery from "@/components/common/PhotoGallery";
import { useGetPublicPropertyByIdQuery } from "@/store/apiSlice";

interface PropertyDetailsClientProps {
  propertyID: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}

export function PropertyDetailsClient({
  propertyID,
  initialData,
}: PropertyDetailsClientProps) {
  const { data: property = initialData, isLoading: _isPropertyLoading } =
    useGetPublicPropertyByIdQuery(propertyID, {
      skip: !!initialData, // Skip the query if we have initial data
    });
  return (
    <>
      <section className="flex-col w-full xl:gap-16 lg:gap-8 md:gap-0 gap-0 xl:px-28 lg:px-14 md:px-8 px-8 max-md:pt-4 max-md:pb-12">
        <div className="py-12 mx-auto">
          <div>
            <h1 className="text-3xl text-gray-900 flex items-center gap-2">
              {property?.bhkType} in {property?.locationOrSocietyName} for{" "}
              {pascalCase(property?.propertyCategory)} in {property?.city}
              <span className="bg-green-500 rounded-lg text-white px-2 py-1 text-sm">
                Active
              </span>
            </h1>
          </div>
        </div>
        <div className="h-96">
          <PhotoGallery
            images={property?.images}
            maxDisplayImages={5}
            className="h-[60vh]"
          />
        </div>
      </section>
    </>
  );
}

"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PropertyDetailsTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
// import { selectFormData } from "@/store/propertyDetailsSlice";
import { ensureEnumValue } from "@/utils/core";
import { apiToForm } from "@/utils/transform/propertyToFormValues";
import { Tab, TabHeader, Tabs } from "@/utility-components";
import { transformPropertyFormToFormValues } from "@/interfaces/FormTransformers";
import {
  setFormData,
  setPropertyCategory,
  setPropertyImages,
} from "@/store/editPropertySlice";
import { RootState } from "@/store/store";

const tabs: { label: string; value: PropertyDetailsTabEnum }[] = [
  { label: "Details", value: PropertyDetailsTabEnum.DETAILS },
  { label: "Owner Details", value: PropertyDetailsTabEnum.OWNER_DETAILS },
  { label: "Shortlist Users", value: PropertyDetailsTabEnum.SHORTLIST },
  { label: "Contact Users", value: PropertyDetailsTabEnum.CONTACT },
  { label: "View Users", value: PropertyDetailsTabEnum.VIEW },
  { label: "Report Users", value: PropertyDetailsTabEnum.REPORT },
];

export default function PropertyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { propertyID } = useParams() as {
    propertyID: string;
  };
  const router = useRouter();
  const currentTabFromUrl = useSelectedLayoutSegment();
  const dispatch = useDispatch();
  const propertyCategory = useSelector(
    (state: RootState) => state.editProperty.propertyCategory,
  );

  const {
    data: propertyDetails,
    isLoading: isLoadingProperty,
    isError,
    error,
  } = useGetPropertyByIdQuery(
    { propertyID: propertyID },
    { skip: !propertyID },
  );
  console.log("propertyDetails: ", propertyDetails);

  // useEffect(() => {
  //   if (isLoading) {
  //     dispatch(setPending());
  //   } else if (isError) {
  //     const errMsg =
  //       typeof error === "string" ? error : "Unknown error fetching property";
  //     dispatch(setRejected(errMsg));
  //   } else if (apiPropertyData) {
  //     const currentProperty = apiToForm(apiPropertyData);
  //     dispatch(setFulfilled(currentProperty));
  //   }
  // }, [isLoading, isError, apiPropertyData, error, dispatch]);

  // Populate form data when existing property data is loaded
  useEffect(() => {
    if (!propertyDetails || isLoadingProperty) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const propertyData = data;
      console.log("Property Details - useEffect:", propertyDetails);
      const apiPropertyData = propertyDetails.property;
      if (!apiPropertyData) return;
      console.log("apiPropertyData: ", apiPropertyData);

      if (apiPropertyData) {
        // Transform API response to FormValues
        const formValues = transformPropertyFormToFormValues(apiPropertyData);

        // Set property category
        dispatch(setPropertyCategory(apiPropertyData.propertyCategory));

        // Set form data
        dispatch(setFormData({ data: formValues }));

        // Set property images
        if (formValues.images && formValues.images.length > 0) {
          const decodedImages = formValues.images.map((image) => {
            return {
              ...image,
              url: decodeURIComponent(image.url),
            };
          });
          dispatch(setPropertyImages({ propertyImages: decodedImages }));
        }
      }
    } catch (error) {
      console.error("Error transforming property data to form values:", error);
    }
  }, [propertyDetails, isLoadingProperty, dispatch]);

  if (isLoadingProperty || isError) {
    return (
      <AsyncFallback
        isLoading={isLoadingProperty}
        isError={isError}
        error={error}
        loadingMessage="Loading property details…"
        errorMessage="Failed to fetch property."
      />
    );
  }

  const activeTab = ensureEnumValue({
    enumObj: PropertyDetailsTabEnum,
    value: currentTabFromUrl,
    fallback: PropertyDetailsTabEnum.DETAILS,
  });

  const handleTabChange = (tab: string) => {
    router.push(
      `/admin/property-details/${propertyCategory.toLowerCase()}/${propertyID}/${tab}`,
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs onTabChange={handleTabChange} defaultActive={activeTab}>
        <TabHeader
          containerClassName="border-b border-gray-200"
          tabsClassName="flex w-full"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              containerClassName="w-full py-3 font-medium"
              activeClassName="text-red-500 border-b-2 border-red-500"
              inactiveClassName="text-gray-500 hover:text-gray-700"
            />
          ))}
        </TabHeader>
      </Tabs>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

"use client";

import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { PropertyDetailsTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { default as DeletePhotosDialog } from "@/dialogs/delete-photos-dialog";
import { default as UploadPhotosDialog } from "@/dialogs/upload-photos-dialog";
import { transformPropertyFormToFormValues } from "@/interfaces/FormTransformers";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import {
  clearFormData,
  setFormData,
  setPropertyCategory,
  setPropertyID,
  setPropertyImages,
} from "@/store/editPropertySlice";
import { setPropertyDetailsFromApi } from "@/store/propertyDetailsSlice";
import { Tab, TabHeader, Tabs } from "@/utility-components";
import { ensureEnumValue } from "@/utils/core";

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
  const { propertyID: propertyIDParam } = useParams() as {
    propertyID: string;
  };
  const router = useRouter();
  const currentTabFromUrl = useSelectedLayoutSegment();
  const dispatch = useDispatch();
  const { isDialogOpen } = useDialog();

  useEffect(() => {
    dispatch(clearFormData());

    // Cleanup on unmount
    return () => {
      dispatch(clearFormData());
    };
  }, [propertyIDParam, dispatch]);

  const {
    data: propertyDetailsRaw,
    isLoading: isLoadingProperty,
    isError,
    error,
  } = useGetPropertyByIdQuery(
    { propertyID: propertyIDParam },
    {
      // skip: !propertyIDParam,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );

  // Populate form data when existing property data is loaded
  useEffect(() => {
    if (!propertyDetailsRaw || isLoadingProperty) return;

    // --- Update propertyDetails slice ---
    dispatch(setPropertyDetailsFromApi(propertyDetailsRaw));
    try {
      console.log("Property Details - raw data: ", propertyDetailsRaw);
      let apiPropertyData = propertyDetailsRaw.property;
      if (apiPropertyData) {
        apiPropertyData = {
          ...apiPropertyData,
          secondaryPhoneNumber:
            propertyDetailsRaw.secondaryPhoneNumber ?? undefined,
        };
      }

      if (!apiPropertyData) {
        return;
      }

      if (apiPropertyData) {
        // Transform API response to FormValues
        const formValues = transformPropertyFormToFormValues(apiPropertyData);

        // Set property category
        dispatch(setPropertyCategory(apiPropertyData.propertyCategory));

        // Set propertyID
        dispatch(setPropertyID(propertyIDParam));

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
  }, [propertyDetailsRaw, isLoadingProperty, propertyIDParam, dispatch]);

  // Initial Hard Loading State
  if (isLoadingProperty) {
    return (
      <AsyncFallback
        isLoading={isLoadingProperty}
        isError={false}
        loadingMessage="Loading property details..."
      />
    );
  }

  // Error State
  if (isError || !propertyDetailsRaw) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch property details."
      />
    );
  }

  const activeTab = ensureEnumValue({
    enumObj: PropertyDetailsTabEnum,
    value: currentTabFromUrl,
    fallback: PropertyDetailsTabEnum.DETAILS,
  });

  const handleTabChange = (tab: string) => {
    router.push(`/admin/properties/${propertyIDParam}/${tab}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ─── HEADER ─── */}
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

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </div>

      {/* Upload Dialog */}
      {isDialogOpen("upload-photos-dialog") && (
        <UploadPhotosDialog id="upload-photos-dialog" />
      )}

      {/* Delete Dialog */}
      {isDialogOpen("delete-photos-dialog") && (
        <DeletePhotosDialog id="delete-photos-dialog" />
      )}
    </div>
  );
}

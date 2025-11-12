"use client";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VerifyPropertyTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import DeletePhotosDialog from "@/dialogs/delete-photos-dialog";
import UploadPhotosDialog from "@/dialogs/upload-photos-dialog";
import { transformPropertyFormToFormValues } from "@/interfaces/FormTransformers";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import {
  setFormData,
  setPropertyCategory,
  setPropertyID,
  setPropertyImages,
} from "@/store/editPropertySlice";
import { setPropertyDetailsFromApi } from "@/store/propertyDetailsSlice";
import { RootState } from "@/store/store";
import { Tab, TabHeader, Tabs } from "@/utility-components";
import { ensureEnumValue } from "@/utils/core";

const tabs: { label: string; value: VerifyPropertyTabEnum }[] = [
  { label: "Details", value: VerifyPropertyTabEnum.DETAILS },
];

export default function VerifyPropertyLayout({
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
  const { isDialogOpen } = useDialog();

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
    { skip: !propertyID, refetchOnMountOrArgChange: true },
  );
  // console.log("propertyDetails: ", propertyDetails);

  // Populate form data when existing property data is loaded
  useEffect(() => {
    if (!propertyDetails || isLoadingProperty) return;

    // --- Update propertyDetails slice ---
    dispatch(setPropertyDetailsFromApi(propertyDetails));
    try {
      // const propertyData = data;
      console.log("Property Details - useEffect:", propertyDetails);
      const apiPropertyData = propertyDetails.property;
      if (!apiPropertyData) {
        return;
      }
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

  // Set propertyID in Redux state when component mounts
  useEffect(() => {
    if (propertyID) {
      dispatch(setPropertyID(propertyID));
    }
  }, [propertyID, dispatch]);

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
    enumObj: VerifyPropertyTabEnum,
    value: currentTabFromUrl,
    fallback: VerifyPropertyTabEnum.DETAILS,
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

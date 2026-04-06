"use client";

import { ChevronLeft, ExternalLink, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { PropertyCategory, PropertyDetailsTabEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { RenderPropertyStatus } from "@/components/status/RenderPropertyStatus";
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
import { ensureEnumValue } from "@/utils/core";

const tabs: { label: string; value: PropertyDetailsTabEnum }[] = [
  { label: "Details", value: PropertyDetailsTabEnum.DETAILS },
  { label: "Owner Details", value: PropertyDetailsTabEnum.OWNER_DETAILS },
  { label: "Shortlist Users", value: PropertyDetailsTabEnum.SHORTLIST },
  { label: "Contact Users", value: PropertyDetailsTabEnum.CONTACT },
  { label: "View Users", value: PropertyDetailsTabEnum.VIEW },
  { label: "Report Users", value: PropertyDetailsTabEnum.REPORT },
];

const categoryColors: Record<string, string> = {
  [PropertyCategory.RENT]: "bg-blue-100 text-blue-800 border-blue-200",
  [PropertyCategory.RESALE]: "bg-purple-100 text-purple-800 border-purple-200",
  [PropertyCategory.FLATMATE]: "bg-teal-100 text-teal-800 border-teal-200",
};

export default function PropertyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { propertyID: propertyIDParam } = useParams() as {
    propertyID: string;
  };
  const currentTabFromUrl = useSelectedLayoutSegment();
  const dispatch = useDispatch();
  const { isDialogOpen } = useDialog();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(clearFormData());
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
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );

  // Horizontal scroll on wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      if (container.scrollWidth > container.clientWidth) {
        if (Math.abs(evt.deltaY) > 0) {
          evt.preventDefault();
          container.scrollLeft += evt.deltaY;
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isLoadingProperty]);

  // Populate form data when existing property data is loaded
  useEffect(() => {
    if (!propertyDetailsRaw || isLoadingProperty) return;

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
        const formValues = transformPropertyFormToFormValues(apiPropertyData);

        dispatch(setPropertyCategory(apiPropertyData.propertyCategory));
        dispatch(setPropertyID(propertyIDParam));
        dispatch(setFormData({ data: formValues }));

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

  // Loading State
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

  const { property, owner } = propertyDetailsRaw;
  const propertyTitle = `${property.bhkType} in ${property.locationOrSocietyName}`;
  const categoryColor =
    categoryColors[property.propertyCategory] ??
    "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ─── COMPACT HEADER ─── */}
      <header className="shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 gap-6 shadow-sm z-10">
        {/* Left: Back + Title + Tags */}
        <div className="flex items-center gap-1 w-[480px] shrink-0">
          <Link
            href="/admin/properties"
            className="flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-md transition-colors"
            title="Back to Properties"
          >
            <ChevronLeft size={20} />
          </Link>

          <div className="flex items-center gap-2 overflow-hidden">
            <h1
              className="text-lg font-semibold text-gray-900 truncate"
              title={propertyTitle}
            >
              {propertyTitle}
            </h1>

            {/* Category Tag */}
            {property.propertyCategory && (
              <span
                className={`shrink-0 text-sm font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider ${categoryColor}`}
              >
                {property.propertyCategory}
              </span>
            )}

            {/* State Tag */}
            <span className="shrink-0">
              <RenderPropertyStatus status={property.propertyState} />
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex-1 flex justify-center overflow-hidden min-w-0 px-4">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200 overflow-x-auto scrollbar-hide max-w-full whitespace-nowrap"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={`/admin/properties/${propertyIDParam}/${tab.value}`}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }
                  `}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right: Owner Link */}
        {owner && (
          <div className="flex items-center justify-end min-w-fit">
            <Link
              href={`/admin/users/${encodeURIComponent(owner.phoneNo)}/profile`}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:underline px-2.5 py-1.5 rounded-lg transition-colors max-w-[200px] group"
              title={`View owner: ${owner.name || owner.phoneNo}`}
            >
              <UserRound
                size={16}
                className="shrink-0 text-gray-400 group-hover:text-gray-600"
              />
              <span className="truncate">{owner.name || owner.phoneNo}</span>
              <ExternalLink
                size={14}
                className="shrink-0 text-gray-300 group-hover:text-gray-500"
              />
            </Link>
          </div>
        )}
      </header>

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

"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { RootState } from "@/store/store";

import FlatmateAdditionalInfoClient from "./FlatmateAdditionalInfoClient";
import RentAdditionalInfoClient from "./RentAdditionalInfoClient";
import ResaleAdditionalInfoClient from "./ResaleAdditionalInfoClient";

export const AdditionalInfoWrapper: React.FC = () => {
  const params = useParams();
  const propertyCategory = useSelector(
    (state: RootState) => state.editProperty.propertyCategory,
  );

  // Determine which component to render based on property category
  const getPropertyCategory = (): PropertyCategory => {
    // First try to get from URL params
    if (params.propertyCategory) {
      const categoryFromUrl = params.propertyCategory as string;
      if (
        Object.values(PropertyCategory).includes(
          categoryFromUrl as PropertyCategory,
        )
      ) {
        return categoryFromUrl as PropertyCategory;
      }
    }

    // Fallback to Redux state
    return propertyCategory;
  };

  const currentPropertyCategory = getPropertyCategory();

  // Render the appropriate component based on property category
  switch (currentPropertyCategory) {
    case PropertyCategory.RENT:
      return <RentAdditionalInfoClient />;
    case PropertyCategory.RESALE:
      return <ResaleAdditionalInfoClient />;
    case PropertyCategory.FLATMATE:
      return <FlatmateAdditionalInfoClient />;
    default:
      // Default to rent details if category is not recognized
      return <RentAdditionalInfoClient />;
  }
};

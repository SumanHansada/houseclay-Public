"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import FlatmateDetailsClient from "@/app/list-property/[propertyCategory]/rental-details/FlatmateDetailsClient";
import RentalDetailsClient from "@/app/list-property/[propertyCategory]/rental-details/RentalDetailsClient";
import { PropertyCategory } from "@/common/enums";
import { RootState } from "@/store/store";

export const RentalDetailsWrapper: React.FC = () => {
  const params = useParams();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
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
      return <RentalDetailsClient />;
    case PropertyCategory.FLATMATE:
      return <FlatmateDetailsClient />;
    default:
      // Default to rental details if category is not recognized
      return <RentalDetailsClient />;
  }
};

export default RentalDetailsWrapper;

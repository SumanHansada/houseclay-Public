"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { pascalCase } from "@/common/utils";
import { RootState } from "@/store/store";

interface PropertyCategoryLoadingProps {
  className?: string;
}

export default function PropertyCategoryLoading({
  className = "",
}: PropertyCategoryLoadingProps) {
  const params = useParams();
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );

  // Determine which property category to show based on URL or Redux state
  const getCurrentPropertyCategory = (): PropertyCategory => {
    // First try to get from URL params
    if (params.propertyCategory) {
      const categoryFromUrl = (params.propertyCategory as string).toUpperCase();
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

  const currentPropertyCategory = getCurrentPropertyCategory();

  return (
    <div
      className={`w-full h-screen flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Loading...</p>
        <p className="text-sm text-gray-500">
          {currentPropertyCategory
            ? `Setting up ${pascalCase(currentPropertyCategory)} form`
            : "Preparing Form..."}
        </p>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import { RootState } from "@/store/store";

interface AdditionalInfoLoadingProps {
  className?: string;
}

// Loading skeleton for RENT and FLATMATE forms (simpler structure)
const RentFlatmateLoadingSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const FormFieldSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <Skeleton height={40} borderRadius={8} />
    </div>
  );

  return (
    <div className={className}>
      {/* Page header */}
      <div className="mb-8">
        <Skeleton width={400} height={36} />
      </div>

      {/* Form content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton for RESALE form (more complex structure)
const ResaleLoadingSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const FormFieldSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <Skeleton height={40} borderRadius={8} />
    </div>
  );

  return (
    <div className={className}>
      {/* Page header */}
      <div className="mb-8">
        <Skeleton width={400} height={36} />
      </div>

      {/* Form content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that determines which loading skeleton to show
const AdditionalInfoLoadingWrapper: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const propertyCategory = useSelector(
    (state: RootState) => state.listProperty.propertyCategory,
  );

  switch (propertyCategory) {
    case PropertyCategory.RENT:
    case PropertyCategory.FLATMATE:
      return <RentFlatmateLoadingSkeleton className={className} />;
    case PropertyCategory.RESALE:
      return <ResaleLoadingSkeleton className={className} />;
    default:
      return <RentFlatmateLoadingSkeleton className={className} />;
  }
};

export default function AdditionalInfoLoading({
  className = "",
}: AdditionalInfoLoadingProps) {
  return <AdditionalInfoLoadingWrapper className={className} />;
}

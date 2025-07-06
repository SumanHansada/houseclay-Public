import React from "react";
import Skeleton from "react-loading-skeleton";

export default function ResaleDetailsLoading() {
  // Skeleton for currency input field with label and icon
  const CurrencyFieldSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Skeleton circle width={20} height={20} />
        </div>
        <Skeleton height={42} borderRadius={8} />
      </div>
    </div>
  );

  // Skeleton for a form field with label
  const FormFieldSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <Skeleton height={42} borderRadius={8} />
    </div>
  );

  // Skeleton for radio group with label
  const RadioGroupSkeleton = ({ width = 300 }) => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <div className="flex gap-4">
        <Skeleton width={width / 2 - 10} height={38} borderRadius={8} />
        <Skeleton width={width / 2 - 10} height={38} borderRadius={8} />
      </div>
    </div>
  );

  // Skeleton for amenities section
  const AmenitiesSkeletonGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array(16)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton circle width={20} height={20} />
            <div className="flex flex-col items-center">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={80} height={16} />
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <Skeleton width={450} height={36} />
      </div>

      {/* Form content */}
      <div>
        {/* Price and Available From */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <CurrencyFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>

        {/* Bathrooms and Balcony */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>

        {/* Price Negotiable and Under Loan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <RadioGroupSkeleton />
          </div>
          <div className="col-span-1">
            <RadioGroupSkeleton />
          </div>
        </div>

        {/* Water Supply and Power Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>

        {/* Furnishing and Parking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>
      </div>

      {/* Amenities section */}
      <div className="mb-8">
        <Skeleton width={300} height={28} className="mb-6" />
        <AmenitiesSkeletonGrid />
      </div>
    </div>
  );
}

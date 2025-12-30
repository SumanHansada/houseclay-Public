import React from "react";

interface ResaleDetailsStepLoadingProps {
  className?: string;
}

export default function ResaleDetailsStepLoading({
  className = "",
}: ResaleDetailsStepLoadingProps) {
  // Reusable skeletons
  const CurrencyFieldSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[180px] bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  const CalendarFieldSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[160px] bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  const SelectDropdownSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[160px] bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  const RadioGroupSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[200px] bg-gray-200 rounded animate-pulse" />
      <div className="flex gap-8">
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  const AmenitiesSectionSkeleton = () => (
    <div className="flex flex-col gap-6">
      <div className="h-7 w-[320px] bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="h-9 w-[420px] bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="space-y-8">
        {/* Expected Price + Available From */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyFieldSkeleton />
          <CalendarFieldSkeleton />
        </div>

        {/* Balcony + Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectDropdownSkeleton />
          <SelectDropdownSkeleton />
        </div>

        {/* Price Negotiable + Under Loan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RadioGroupSkeleton />
          <RadioGroupSkeleton />
        </div>

        {/* Water Supply + Power Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectDropdownSkeleton />
          <SelectDropdownSkeleton />
        </div>

        {/* Furnishing + Parking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectDropdownSkeleton />
          <SelectDropdownSkeleton />
        </div>

        {/* Amenities Section */}
        <div className="mt-10">
          <AmenitiesSectionSkeleton />
        </div>
      </div>
    </div>
  );
}

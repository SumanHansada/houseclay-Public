import React from "react";

interface RentalDetailsStepLoadingProps {
  className?: string;
}

export default function RentalDetailsStepLoading({
  className = "",
}: RentalDetailsStepLoadingProps) {
  // Reusable skeletons
  const CurrencyFieldSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[140px] bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  const RadioGroupSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[180px] bg-gray-200 rounded animate-pulse" />
      <div className="flex gap-8">
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  const SelectDropdownSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[160px] bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  const CalendarFieldSkeleton = () => (
    <div className="flex flex-col gap-2">
      <div className="h-5 w-[160px] bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  const CheckboxGroupSkeleton = ({ columns = 4, rows = 2 }) => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: columns * rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AmenitiesSectionSkeleton = () => (
    <div className="flex flex-col gap-4">
      <div className="h-7 w-[300px] bg-gray-200 rounded animate-pulse" />
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
        {/* Rent + Rent Negotiable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyFieldSkeleton />
          <RadioGroupSkeleton />
        </div>

        {/* Maintenance + Deposit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyFieldSkeleton />
          <CurrencyFieldSkeleton />
        </div>

        {/* Available From + Furnishing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CalendarFieldSkeleton />
          <SelectDropdownSkeleton />
        </div>

        {/* Preferred Tenants (4 options with icons) */}
        <div className="mb-6">
          <div className="h-5 w-[200px] mb-4 bg-gray-200 rounded animate-pulse" />
          <CheckboxGroupSkeleton columns={4} rows={1} />
        </div>

        {/* Balcony + Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectDropdownSkeleton />
          <SelectDropdownSkeleton />
        </div>

        {/* Water Supply + Power Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectDropdownSkeleton />
          <SelectDropdownSkeleton />
        </div>

        {/* Parking + Non-Veg Allowed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectDropdownSkeleton />
          <RadioGroupSkeleton />
        </div>

        {/* Amenities Section */}
        <div className="mt-10">
          <AmenitiesSectionSkeleton />
        </div>
      </div>
    </div>
  );
}

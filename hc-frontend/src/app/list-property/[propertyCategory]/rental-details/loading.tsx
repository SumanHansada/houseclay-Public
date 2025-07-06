import React from "react";
import Skeleton from "react-loading-skeleton";

interface RentalDetailsLoadingProps {
  formType?: "rentForm" | "flatmatesForm";
  className?: string;
}

export default function RentalDetailsLoading({
  formType = "rentForm",
  className = "",
}: RentalDetailsLoadingProps) {
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

  // Skeleton for a radio group with icons
  const IconRadioGroupSkeleton = ({ options = 4 }) => (
    <div className="flex flex-col gap-3 mb-2">
      <Skeleton width={170} height={20} />
      <div className="flex gap-4">
        {Array(options)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={70} height={16} />
            </div>
          ))}
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
    <div className={className}>
      {/* Page header */}
      <div className="mb-8">
        <Skeleton width={450} height={36} />
      </div>

      {/* Form content */}
      <div>
        {/* Rent and negotiable section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <CurrencyFieldSkeleton />
          </div>
          <div className="col-span-1">
            {formType === "rentForm" ? (
              <RadioGroupSkeleton />
            ) : (
              <FormFieldSkeleton />
            )}
          </div>
        </div>

        {/* Maintenance and deposit section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <CurrencyFieldSkeleton />
          </div>
          <div className="col-span-1">
            <CurrencyFieldSkeleton />
          </div>
        </div>

        {/* Available from and furnishing section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>

        {/* Preferred tenant section - Rent Form */}
        {formType === "rentForm" && (
          <div className="mb-6">
            <IconRadioGroupSkeleton options={4} />
          </div>
        )}

        {/* Tenant type and food preferences - Flatmates Form */}
        {formType === "flatmatesForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <IconRadioGroupSkeleton options={2} />
            <IconRadioGroupSkeleton options={2} />
          </div>
        )}

        {/* Water and power backup section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
          <div className="col-span-1">
            <FormFieldSkeleton />
          </div>
        </div>

        {/* Parking and Non-veg section - Rent Form */}
        {formType === "rentForm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <FormFieldSkeleton />
            </div>
            <div className="col-span-1">
              <RadioGroupSkeleton />
            </div>
          </div>
        )}

        {/* Bathroom and preferences section - Flatmates Form */}
        {formType === "flatmatesForm" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <RadioGroupSkeleton />
              </div>
              <div className="col-span-1">
                <RadioGroupSkeleton />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <RadioGroupSkeleton />
              </div>
              <div className="col-span-1">
                <RadioGroupSkeleton />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Amenities section */}
      <div className="mb-8">
        <Skeleton width={300} height={28} className="mb-6" />
        <AmenitiesSkeletonGrid />
      </div>
    </div>
  );
}

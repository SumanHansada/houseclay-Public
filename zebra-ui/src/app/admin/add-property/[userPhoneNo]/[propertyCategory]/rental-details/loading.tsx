"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

interface RentalDetailsLoadingProps {
  className?: string;
}

export default function RentalDetailsLoading({
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
              <Skeleton width={60} height={16} />
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <Skeleton height={36} width="60%" className="mb-2" />
        <Skeleton height={20} width="80%" />
      </div>

      <div className="space-y-6">
        {/* Expected Rent */}
        <CurrencyFieldSkeleton />

        {/* Available From */}
        <FormFieldSkeleton />

        {/* Security Deposit */}
        <CurrencyFieldSkeleton />

        {/* Maintenance Charges */}
        <CurrencyFieldSkeleton />

        {/* Preferred Tenants */}
        <IconRadioGroupSkeleton options={4} />

        {/* Food Preferences */}
        <RadioGroupSkeleton width={400} />

        {/* Amenities */}
        <div className="mb-6">
          <Skeleton height={24} width={120} className="mb-4" />
          <AmenitiesSkeletonGrid />
        </div>

        {/* Parking */}
        <RadioGroupSkeleton width={300} />

        {/* Furnishing Status */}
        <RadioGroupSkeleton width={400} />
      </div>
    </div>
  );
}

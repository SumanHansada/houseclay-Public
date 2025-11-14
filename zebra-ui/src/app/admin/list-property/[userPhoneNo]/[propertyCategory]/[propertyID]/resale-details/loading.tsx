"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

interface ResaleDetailsLoadingProps {
  className?: string;
}

export default function ResaleDetailsLoading({
  className = "",
}: ResaleDetailsLoadingProps) {
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

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <Skeleton height={36} width="60%" className="mb-2" />
        <Skeleton height={20} width="80%" />
      </div>

      <div className="space-y-6">
        {/* Expected Price */}
        <CurrencyFieldSkeleton />

        {/* Price Per Sq Ft */}
        <CurrencyFieldSkeleton />

        {/* Possession Status */}
        <FormFieldSkeleton />

        {/* Age of Property */}
        <FormFieldSkeleton />

        {/* Furnishing Status */}
        <RadioGroupSkeleton width={400} />

        {/* Parking */}
        <RadioGroupSkeleton width={300} />
      </div>
    </div>
  );
}

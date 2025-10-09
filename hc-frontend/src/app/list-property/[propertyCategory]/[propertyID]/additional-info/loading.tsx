"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

interface AdditionalInfoLoadingProps {
  className?: string;
}

export default function AdditionalInfoLoading({
  className = "",
}: AdditionalInfoLoadingProps) {
  // Skeleton for a form field with label
  const FormFieldSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <Skeleton height={42} borderRadius={8} />
    </div>
  );

  // Skeleton for textarea with label
  const TextareaSkeleton = () => (
    <div className="flex flex-col gap-2 mb-2">
      <Skeleton width={150} height={20} />
      <Skeleton height={120} borderRadius={8} />
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
        {/* Contact Number */}
        <FormFieldSkeleton />

        {/* WhatsApp Number */}
        <FormFieldSkeleton />

        {/* Description */}
        <TextareaSkeleton />

        {/* Property Highlights */}
        <TextareaSkeleton />

        {/* Contact Preference */}
        <RadioGroupSkeleton width={400} />

        {/* Best Time to Contact */}
        <FormFieldSkeleton />
      </div>
    </div>
  );
}

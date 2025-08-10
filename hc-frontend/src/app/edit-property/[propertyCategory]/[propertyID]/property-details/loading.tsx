"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

interface PropertyDetailsLoadingProps {
  className?: string;
}

export default function PropertyDetailsLoading({
  className = "",
}: PropertyDetailsLoadingProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <Skeleton height={36} width="60%" className="mb-2" />
        <Skeleton height={20} width="80%" />
      </div>

      <div className="space-y-6">
        {/* Property Type Dropdown */}
        <div>
          <Skeleton height={20} width={120} className="mb-1" />
          <Skeleton height={48} />
        </div>

        {/* Built Up Area & Facing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton height={20} width={100} className="mb-1" />
            <Skeleton height={48} />
          </div>
          <div>
            <Skeleton height={20} width={80} className="mb-1" />
            <Skeleton height={48} />
          </div>
        </div>

        {/* BHK Type, Ownership Type, Property Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton height={20} width={100} className="mb-1" />
              <Skeleton height={48} />
            </div>
          ))}
        </div>

        {/* Floor, Total Floor, Floor Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton height={20} width={80} className="mb-1" />
              <Skeleton height={48} />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-6">
          <Skeleton height={20} width={100} className="mb-1" />
          <Skeleton height={120} />
        </div>
      </div>
    </div>
  );
}

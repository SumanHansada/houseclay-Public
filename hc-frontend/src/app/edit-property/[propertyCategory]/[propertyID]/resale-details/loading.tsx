"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

export default function ResaleDetailsLoading() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <Skeleton height={36} width="60%" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Skeleton height={48} />
        <Skeleton height={48} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Skeleton height={48} />
        <Skeleton height={48} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Skeleton height={48} />
        <Skeleton height={48} />
      </div>
      <div className="mb-8">
        <Skeleton height={28} width="40%" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} height={42} />
          ))}
        </div>
      </div>
    </div>
  );
}

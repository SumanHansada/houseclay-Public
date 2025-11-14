"use client";

import React from "react";

import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";

const PropertyVerificationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Sticky top filter bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm px-16 py-2">
        <SearchAndFilterBar />
      </div>

      <main className="flex-1 bg-gray-100 px-16 py-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default PropertyVerificationLayout;

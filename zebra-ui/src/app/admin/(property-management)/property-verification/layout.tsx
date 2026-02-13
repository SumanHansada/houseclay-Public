"use client";

import React from "react";

import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";

const PropertyVerificationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky top filter bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm px-8 py-4">
        <SearchAndFilterBar />
      </div>

      <section className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {children}
      </section>
    </div>
  );
};

export default PropertyVerificationLayout;

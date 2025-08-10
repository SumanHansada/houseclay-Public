"use client";

import { Loader2 } from "lucide-react";
import React from "react";

const PropertyCategoryLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-gray-600">Loading property category...</p>
      </div>
    </div>
  );
};

export default PropertyCategoryLoading;

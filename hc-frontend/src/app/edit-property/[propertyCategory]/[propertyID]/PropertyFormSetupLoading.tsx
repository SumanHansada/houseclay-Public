import { Loader2 } from "lucide-react";
import React from "react";

export default function PropertyFormSetupLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-gray-600">Loading property form...</p>
      </div>
    </div>
  );
}

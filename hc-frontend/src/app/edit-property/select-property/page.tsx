"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function SelectPropertyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Select Property to Edit
        </h1>
        <p className="text-gray-600 mb-8">
          Please select a property from your listings to edit.
        </p>
        <button
          onClick={() => router.push("/my-properties")}
          className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          View My Properties
        </button>
      </div>
    </div>
  );
}

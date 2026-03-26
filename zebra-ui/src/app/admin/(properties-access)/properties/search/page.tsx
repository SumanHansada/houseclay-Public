import { Suspense } from "react";

import { PropertySearchClient } from "./PropertySearchClient";

export default function PropertySearchPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 overflow-hidden relative">
      <Suspense fallback={<div>Loading...</div>}>
        <PropertySearchClient />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";

import { PropertySearchTableView } from "./PropertySearchTableView";

export default function PropertySearchPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 overflow-hidden relative">
      <Suspense fallback={<div>Loading...</div>}>
        <PropertySearchTableView />
      </Suspense>
    </div>
  );
}

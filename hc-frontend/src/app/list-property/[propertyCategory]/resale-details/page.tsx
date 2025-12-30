import { Suspense } from "react";

import { PropertyCategory } from "@/common/enums";

import { default as ResaleDetailsStepLoading } from "./loading";
import ResaleDetailsClient from "./ResaleDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Error boundary component
function ResaleDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function ResaleDetailsPage() {
  return (
    <ResaleDetailsErrorBoundary>
      <Suspense fallback={<ResaleDetailsStepLoading />}>
        <ResaleDetailsClient />
      </Suspense>
    </ResaleDetailsErrorBoundary>
  );
}

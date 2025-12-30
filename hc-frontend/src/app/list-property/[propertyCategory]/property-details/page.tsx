import { Suspense } from "react";

import { PropertyCategory } from "@/common/enums";

import { default as PropertyDetailsStepLoading } from "./loading";
import PropertyDetailsClient from "./PropertyDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Error boundary component
function PropertyDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function PropertyDetailsPage() {
  return (
    <PropertyDetailsErrorBoundary>
      <Suspense fallback={<PropertyDetailsStepLoading />}>
        <PropertyDetailsClient />
      </Suspense>
    </PropertyDetailsErrorBoundary>
  );
}

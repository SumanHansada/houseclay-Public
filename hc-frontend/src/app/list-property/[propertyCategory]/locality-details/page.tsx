import { Suspense } from "react";

import { PropertyCategory } from "@/common/enums";
import { LocalityDetailsStepLoading } from "@/components/loading";

import LocalityDetailsClient from "./LocalityDetailsClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Error boundary component
function LocalityDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function LocalityDetailsPage() {
  return (
    <LocalityDetailsErrorBoundary>
      <Suspense fallback={<LocalityDetailsStepLoading />}>
        <LocalityDetailsClient />
      </Suspense>
    </LocalityDetailsErrorBoundary>
  );
}

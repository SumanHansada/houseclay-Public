import { Suspense } from "react";

import { PropertyCategory } from "@/common/enums";
import { AdditionalInfoStepLoading } from "@/components/loading";

import AdditionalInfoClient from "./AdditionalInfoClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Error boundary component
function AdditionalInfoErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function AdditionalInfoPage() {
  return (
    <AdditionalInfoErrorBoundary>
      <Suspense fallback={<AdditionalInfoStepLoading />}>
        <AdditionalInfoClient />
      </Suspense>
    </AdditionalInfoErrorBoundary>
  );
}

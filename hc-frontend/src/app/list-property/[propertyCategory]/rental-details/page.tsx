import { Suspense } from "react";

import { PropertyCategory } from "@/common/enums";
import { RentalDetailsStepLoading } from "@/components/loading";

import RentalDetailsWrapper from "./RentalDetailsWrapper";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Error boundary component
function RentalDetailsErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export default function RentalDetailsPage() {
  return (
    <RentalDetailsErrorBoundary>
      <Suspense fallback={<RentalDetailsStepLoading />}>
        <RentalDetailsWrapper />
      </Suspense>
    </RentalDetailsErrorBoundary>
  );
}

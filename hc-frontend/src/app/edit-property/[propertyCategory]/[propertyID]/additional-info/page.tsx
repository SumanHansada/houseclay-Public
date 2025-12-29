import { Suspense } from "react";

import { AdditionalInfoStepLoading } from "@/components/loading";

import AdditionalInfoClient from "./AdditionalInfoClient";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

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

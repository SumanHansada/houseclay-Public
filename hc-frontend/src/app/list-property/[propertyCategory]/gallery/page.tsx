import { Suspense } from "react";

import { PropertyCategory } from "@/common/enums";
import { GalleryStepLoading } from "@/components/loading";

import GalleryClient from "./GalleryClient";

export async function generateStaticParams() {
  return [
    { propertyCategory: PropertyCategory.RENT.toLowerCase() },
    { propertyCategory: PropertyCategory.RESALE.toLowerCase() },
    { propertyCategory: PropertyCategory.FLATMATE.toLowerCase() },
  ];
}

// Error boundary component
function GalleryErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export default function GalleryPage() {
  return (
    <GalleryErrorBoundary>
      <Suspense fallback={<GalleryStepLoading />}>
        <GalleryClient />
      </Suspense>
    </GalleryErrorBoundary>
  );
}

import { Suspense } from "react";

import GalleryClient from "./GalleryClient";
import GalleryPageLoading from "./loading";

// Force dynamic rendering to avoid server component issues
export const dynamic = "force-dynamic";

// Error boundary component
function GalleryErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export default function GalleryPage() {
  return (
    <GalleryErrorBoundary>
      <Suspense fallback={<GalleryPageLoading />}>
        <GalleryClient />
      </Suspense>
    </GalleryErrorBoundary>
  );
}

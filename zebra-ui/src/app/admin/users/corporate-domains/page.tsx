import React, { Suspense } from "react";

import AsyncFallback from "@/components/AsyncFallback";

import { CorporateDomainsTableView } from "./CorporateDomainsTableView";

export const dynamic = "force-dynamic";

export default async function CorporateDomainsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Suspense
      fallback={
        <AsyncFallback
          isLoading={true}
          isError={false}
          loadingMessage="Loading corporate domains..."
        />
      }
    >
      <CorporateDomainsTableView currentPage={currentPage} />
    </Suspense>
  );
}

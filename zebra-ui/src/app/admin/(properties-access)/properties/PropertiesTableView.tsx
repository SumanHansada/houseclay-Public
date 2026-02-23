"use client";

import { Eye } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useTransition } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetPropertiesQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/tableColumnBuilders";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const ROWS_PER_PAGE = 12;

export const PropertiesTableView = ({
  currentPage,
  searchTerm,
}: {
  currentPage: number;
  searchTerm: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  console.log(searchTerm);

  // update URL
  const updateURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      // (Handle search term setting here if SearchAndFilterBar uses it)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  // Get All Properties (Paginated)
  const {
    data: paginatedPropertyData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetPropertiesQuery(
    {
      page: currentPage - 1,
      size: ROWS_PER_PAGE,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { content: propertyList = [], totalPages = 0 } =
    paginatedPropertyData || {};

  useEffect(() => {
    if (!isLoading && totalPages > 0 && currentPage > totalPages) {
      updateURL(1);
    }
  }, [totalPages, currentPage, isLoading, updateURL]);

  const rows: SerializedPropertyRow[] = propertyList.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
    }),
  );

  const handleView = (row: SerializedPropertyRow) => {
    router.push(`/admin/properties/${row.propertyID}`);
  };

  const columns = buildPropertyColumns([
    {
      icon: Eye,
      tooltip: "View Property Details",
      onClick: handleView,
    },
  ]);

  // Initial Hard Loading State
  if (isLoading) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={false}
        loadingMessage="Loading properties..."
      />
    );
  }

  // Error State
  if (isError || !paginatedPropertyData) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch Properties."
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky top filter bar */}
      <div className="h-16 sticky top-0 z-10 bg-white border border-b-gray-200 shadow-sm px-8 flex items-center">
        <SearchAndFilterBar />
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
          {/* Table Header */}
          <div className="flex justify-between items-center px-1">
            <h1 className="text-xl font-medium">All Listed Properties</h1>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(prop) => prop.propertyID}
              noDataMessage="No Properties found."
              isLoading={isFetching || isPending}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom pagination */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={updateURL}
          isLoading={isFetching || isPending}
        />
      </div>
    </div>
  );
};

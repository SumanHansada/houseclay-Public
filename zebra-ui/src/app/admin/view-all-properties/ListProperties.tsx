"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import Spinner from "@/components/Spinner";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetPropertiesQuery } from "@/store/apiSlice";
import {
  buildPropertyColumns,
  createDefaultPropertyActions,
} from "@/utils/table/buildPropertyColumns";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const ROWS_PER_PAGE = 12;

export const ListProperties = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

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
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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

  const rows: SerializedPropertyRow[] = propertyList.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
    }),
  );

  const columns = buildPropertyColumns(
    createDefaultPropertyActions({
      onView: (row) =>
        router.push(
          `/admin/property-details/${row.propertyCategory.toLowerCase()}/${row.propertyID}`,
        ),
    }),
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 bg-white border border-b-gray-200 shadow-sm px-8 py-4">
          <SearchAndFilterBar />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-50 p-8 overflow-hidden">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl border border-gray-200 relative overflow-hidden">
            {/* Blocks interaction with table while fetching */}
            {isFetching && (
              <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="bg-white p-4 rounded-full shadow-lg border flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                All Listed Properties
              </h1>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              <div
                className={
                  isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
                }
              >
                <DataTable
                  columns={columns}
                  data={rows}
                  getRowId={(prop) => prop.propertyID}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            isLoading={isFetching}
          />
        </div>
      </div>
    </div>
  );
};

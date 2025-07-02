"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { PropertyInfo } from "@/interfaces/Property";
import { buildPropertyColumns } from "@/utils/table/buildPropertyColumns";
import { useGetPropertiesQuery } from "@/store/apiSlice";
import AsyncFallback from "@/components/AsyncFallback";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

export const ListProperties = () => {
  const router = useRouter();
  // const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const {
    data: paginatedPropertyData,
    isLoading,
    isError,
    error,
  } = useGetPropertiesQuery(
    {
      page: currentPage - 1,
      size: rowsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  if (isLoading || isError || !paginatedPropertyData) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || !paginatedPropertyData}
        error={error}
        loadingMessage="Loading all properties…"
        errorMessage="Failed to fetch Properties."
      />
    );
  }

  const {
    content: propertyList,
    totalPages,
    first: isFirst,
    last: isLast,
  } = paginatedPropertyData;

  const viewPropertyDetails = (type: string, propertyID: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}`);
  };

  const rows: PropertyRow[] = propertyList.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const columns = buildPropertyColumns(viewPropertyDetails);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm px-16 py-2">
          <SearchAndFilterBar />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-6 px-16">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4 gap-4">
            <h1 className="text-2xl font-medium">All Listed Properties</h1>
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(prop) => prop.propertyID}
            />
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            isFirst={isFirst}
            isLast={isLast}
            goToPage={goToPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
};

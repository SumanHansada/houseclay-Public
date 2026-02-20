"use client";

import { ClipboardCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useTransition } from "react";

import { VerifyPropertyStatusEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import { useStatusBasedPropertyFetch } from "@/hooks/useStatusBasedPropertyFetch";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { buildPropertyColumns } from "@/utils/tableColumnBuilders";

const ROWS_PER_PAGE = 10;

interface Props {
  status: VerifyPropertyStatusEnum;
  currentPage: number;
  searchTerm: string;
}

export const VerificationTableView = ({
  status,
  currentPage,
  searchTerm,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  console.log(searchTerm);

  // ─── URL UPDATE LOGIC ───
  const updateURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  // ─── DATA FETCHING ───
  const {
    data: paginatedPropertyData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useStatusBasedPropertyFetch({
    status,
    page: currentPage - 1,
    size: ROWS_PER_PAGE,
  });

  const { content: allProperties = [], totalPages = 0 } =
    paginatedPropertyData || {};

  // ─── OUT OF BOUNDS CORRECTION ───
  useEffect(() => {
    if (!isLoading && totalPages > 0 && currentPage > totalPages) {
      updateURL(1);
    }
  }, [totalPages, currentPage, isLoading, updateURL]);

  // ─── HANDLERS ───
  const handleView = (row: PropertyInfo) => {
    router.push(`/admin/properties/verification/${status}/${row.propertyID}`);
  };

  const columns = buildPropertyColumns([
    {
      icon: ClipboardCheck,
      tooltip: "Verify Listing",
      onClick: handleView,
    },
  ]);

  const rows = allProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
  }));

  const handleStatusChange = (newStatus: VerifyPropertyStatusEnum) => {
    if (newStatus === status) return;

    // Preserve search params when toggling status, but reset to page 1
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    startTransition(() => {
      router.push(
        `/admin/properties/verification/${newStatus}?${params.toString()}`,
      );
    });
  };

  // ─── ERROR & LOADING STATES ───
  if (isLoading) {
    return (
      <AsyncFallback isLoading={true} loadingMessage="Loading properties..." />
    );
  }

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
      {/* Sticky top status title bar */}
      <div className="sticky top-0 z-20 flex items-center justify-center border-b border-gray-200 bg-white shadow-sm px-8 h-16">
        <SearchAndFilterBar />
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
          {/* Table Header */}
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium">
                {status === VerifyPropertyStatusEnum.VERIFY
                  ? "Properties to be Verified"
                  : "Properties to be Re-verified"}
              </h1>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            {/* Status Toggle Buttons */}
            <div className="flex gap-2 items-center">
              <h2 className="text-xl font-medium">Status:</h2>
              <button
                className={`py-1 px-3 rounded-lg border transition-colors ${
                  status === VerifyPropertyStatusEnum.VERIFY
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                }`}
                onClick={() =>
                  handleStatusChange(VerifyPropertyStatusEnum.VERIFY)
                }
              >
                Pending
              </button>
              <button
                className={`py-1 px-3 rounded-lg border transition-colors ${
                  status === VerifyPropertyStatusEnum.REVERIFY
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                }`}
                onClick={() =>
                  handleStatusChange(VerifyPropertyStatusEnum.REVERIFY)
                }
              >
                Reported
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(prop) => prop.propertyID}
              noDataMessage="No properties found for this status."
              isLoading={isFetching || isPending}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom pagination */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-4 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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

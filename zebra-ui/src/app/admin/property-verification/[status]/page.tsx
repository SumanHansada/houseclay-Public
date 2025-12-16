"use client";

import { ClipboardCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { VerifyPropertyStatusEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { VerifySeededButton } from "@/components/seeder/VerifySeededButton";
import Spinner from "@/components/Spinner";
import { useStatusBasedPropertyFetch } from "@/hooks/useStatusBasedPropertyFetch";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { buildPropertyColumns } from "@/utils/table/buildPropertyColumns";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const ROWS_PER_PAGE = 10;

const PropertyVerificationTablePage: React.FC = () => {
  const router = useRouter();
  const { status } = useParams() as { status: VerifyPropertyStatusEnum };
  const [currentPage, setCurrentPage] = useState(1);

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

  const {
    content: allProperties,
    totalPages,
    first: isFirst,
    last: isLast,
  } = paginatedPropertyData;

  const rows: SerializedPropertyRow[] = allProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
    }),
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);
  const viewPropertyDetails = (
    propertyCategory: string,
    propertyID: string,
  ) => {
    const verifyPath = `/admin/property-details/${propertyCategory.toLowerCase()}/verify/${propertyID}`;
    const reverifyPath = `/admin/property-details/${propertyCategory.toLowerCase()}/reverify/${propertyID}`;
    const currentPath =
      status === VerifyPropertyStatusEnum.VERIFY ? verifyPath : reverifyPath;
    router.push(currentPath);
  };

  const columns = buildPropertyColumns({
    verify: {
      icon: ClipboardCheck,
      tooltip: "Verify Listing",
      onClick: (row) =>
        viewPropertyDetails(row.propertyCategory, row.propertyID),
      classNameIcon: "size-5 text-primary",
    },
  });

  const handleStatusChange = (newStatus: VerifyPropertyStatusEnum) => {
    setCurrentPage(1);
    router.push(`/admin/property-verification/${newStatus}`);
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-sm rounded-xl">
      {/* Header Section - Title and Status buttons */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">
            {status === VerifyPropertyStatusEnum.VERIFY
              ? "Properties to be Verified"
              : "Properties to be Re-verified"}
          </h1>

          <div className="flex gap-3 items-center">
            {/* NEW SEED BUTTON */}
            {status === VerifyPropertyStatusEnum.VERIFY && true && (
              <VerifySeededButton />
            )}

            <h1 className="text-2xl font-medium">Status:</h1>
            <button
              className={`py-2 px-3 rounded-xl border border-red-500 ${
                status === VerifyPropertyStatusEnum.VERIFY
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500"
              }`}
              onClick={() =>
                handleStatusChange(VerifyPropertyStatusEnum.VERIFY)
              }
            >
              Pending
            </button>
            <button
              className={`py-2 px-3 rounded-xl border border-red-500 ${
                status === VerifyPropertyStatusEnum.REVERIFY
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500"
              }`}
              onClick={() =>
                handleStatusChange(VerifyPropertyStatusEnum.REVERIFY)
              }
            >
              Reported
            </button>
          </div>
        </div>
      </div>

      {/* Table Section with IsFetching Overlay */}
      <div className="flex-1 px-4 py-2 overflow-y-auto relative min-h-[400px]">
        {/* THE FIX: Overlay for pagination transition */}
        {isFetching && (
          <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <Spinner size="lg" />
          </div>
        )}

        <div
          className={
            isFetching
              ? "opacity-40 transition-opacity"
              : "opacity-100 transition-opacity"
          }
        >
          <DataTable
            columns={columns}
            data={rows}
            getRowId={(prop) => prop.propertyID}
            noDataMessage="No properties found for this status."
          />
        </div>
      </div>

      {/* Bottom section with Pagination */}
      <div className="border-t border-gray-200">
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          isFirst={isFirst}
          isLast={isLast}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          footerPadding="px-4 py-2"
        />
      </div>
    </div>
  );
};

export default PropertyVerificationTablePage;

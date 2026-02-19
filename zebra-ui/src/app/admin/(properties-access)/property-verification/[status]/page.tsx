"use client";

import { ClipboardCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { VerifyPropertyStatusEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { useStatusBasedPropertyFetch } from "@/hooks/useStatusBasedPropertyFetch";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { buildPropertyColumns } from "@/utils/buildPropertyColumns";

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

  const { content: allProperties, totalPages } = paginatedPropertyData;

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
  const handleView = (row: SerializedPropertyRow) => {
    const verifyPath = `/admin/property-details/${row.propertyCategory.toLowerCase()}/verify/${row.propertyID}`;
    const reverifyPath = `/admin/property-details/${row.propertyCategory.toLowerCase()}/reverify/${row.propertyID}`;
    const currentPath =
      status === VerifyPropertyStatusEnum.VERIFY ? verifyPath : reverifyPath;
    router.push(currentPath);
  };

  const columns = buildPropertyColumns([
    {
      icon: ClipboardCheck,
      tooltip: "Verify Listing",
      onClick: handleView,
    },
  ]);

  const handleStatusChange = (newStatus: VerifyPropertyStatusEnum) => {
    setCurrentPage(1);
    router.push(`/admin/property-verification/${newStatus}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Main Content Area - Matches ListAll's gray bg and padding */}
      <div className="flex-1 flex flex-col bg-gray-50 p-8 overflow-hidden">
        {/* White Card Container - Matches ListAll's structure */}
        <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl border border-gray-200 relative overflow-hidden">
          {/* Header Section - Title, page info, and status buttons; matches ListAll header with added buttons */}
          <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {status === VerifyPropertyStatusEnum.VERIFY
                  ? "Properties to be Verified"
                  : "Properties to be Re-verified"}
              </h1>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            {/* Status Toggle Buttons - Flex for alignment */}
            <div className="flex gap-3 items-center">
              {/* TEST - Verify Seeded Button */}
              {/* {status === VerifyPropertyStatusEnum.VERIFY && !true && (
                <VerifySeededButton />
              )} */}

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

          {/* Table Wrapper */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(prop) => prop.propertyID}
              noDataMessage="No properties found for this status."
              isLoading={isFetching}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Pagination - Matches ListAll exactly */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-4 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};

export default PropertyVerificationTablePage;

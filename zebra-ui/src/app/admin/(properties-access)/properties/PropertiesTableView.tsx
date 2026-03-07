"use client";

import { Eye, ClipboardCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useTransition } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
import SelectDropdown from "@/base-components/SelectDropdown";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { PropertyState, VerifyPropertyStatusEnum } from "@/common/enums";
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

  const stateParam = searchParams.get("state") || "ALL";
  const sortOrderParam = searchParams.get("sortOrder") || "desc";

  // update URL
  const updateURL = useCallback(
    (page: number, newState?: string, newSortOrder?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());

      if (newState !== undefined) {
        if (newState === "ALL") params.delete("state");
        else params.set("state", newState);
      }

      if (newSortOrder !== undefined) {
        if (newSortOrder === "desc")
          params.delete("sortOrder"); // default
        else params.set("sortOrder", newSortOrder);
      }

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
      state: stateParam !== "ALL" ? stateParam : undefined,
      sortOrder: sortOrderParam,
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

  const handleVerify = (row: SerializedPropertyRow) => {
    let statusRoute = VerifyPropertyStatusEnum.VERIFY;
    if (row.propertyState === PropertyState.PENDING_RE_VERIFICATION) {
      statusRoute = VerifyPropertyStatusEnum.REVERIFY;
    } else if (row.propertyState === PropertyState.PENDING_ROUTINE_CHECK) {
      statusRoute = VerifyPropertyStatusEnum.ROUTINE_CHECK;
    }
    router.push(
      `/admin/properties/verification/${statusRoute}/${row.propertyID}`,
    );
  };

  const columns = buildPropertyColumns([
    {
      icon: ClipboardCheck,
      tooltip: "Verify Listing",
      onClick: handleVerify,
      show: (row) =>
        [
          PropertyState.PENDING_VERIFICATION,
          PropertyState.PENDING_RE_VERIFICATION,
          PropertyState.PENDING_ROUTINE_CHECK,
        ].includes(row.propertyState as PropertyState),
    },
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
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium">All Listed Properties</h1>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <SelectDropdown
                name="property-state-filter"
                id="property-state-filter"
                value={stateParam}
                onChange={(val) => updateURL(1, val as string, sortOrderParam)}
                options={[
                  { label: "All Properties", value: "ALL" },
                  {
                    label: "Pending Verification",
                    value: PropertyState.PENDING_VERIFICATION,
                  },
                  {
                    label: "Pending Re-Verification",
                    value: PropertyState.PENDING_RE_VERIFICATION,
                  },
                  {
                    label: "Pending Routine Check",
                    value: PropertyState.PENDING_ROUTINE_CHECK,
                  },
                  { label: "Active", value: PropertyState.ACTIVE },
                  { label: "Inactive", value: PropertyState.INACTIVE },
                ]}
                variant="outline"
                containerClassName="w-56"
                buttonClassName="flex justify-between items-center w-full px-4 py-2 border rounded-xl text-left bg-white text-gray-700"
                dropdownClassName="absolute right-0 z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
              />

              <SelectDropdown
                name="property-sort-order"
                id="property-sort-order"
                value={sortOrderParam}
                onChange={(val) => updateURL(1, stateParam, val as string)}
                options={[
                  { label: "Newest First", value: "desc" },
                  { label: "Oldest First", value: "asc" },
                ]}
                variant="outline"
                containerClassName="w-40"
                buttonClassName="flex justify-between items-center w-full px-4 py-2 border rounded-xl text-left bg-white text-gray-700"
                dropdownClassName="absolute right-0 z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
              />
            </div>
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

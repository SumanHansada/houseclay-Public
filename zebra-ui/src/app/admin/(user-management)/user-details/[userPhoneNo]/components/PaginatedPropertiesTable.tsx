"use client";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { useLocalPagination } from "@/hooks/useLocalPagination";

interface PaginatedPropertiesTableProps<
  RowType extends { propertyID: string; _serial: number },
> {
  tableTitle: string;
  columns: Column<RowType>[];
  rows: RowType[];
  isLoading?: boolean;
  rowsPerPage?: number;
}

export function PaginatedPropertiesTable<
  RowType extends { propertyID: string; _serial: number },
>(props: PaginatedPropertiesTableProps<RowType>) {
  const {
    tableTitle,
    columns,
    rows,
    isLoading = false,
    rowsPerPage = 10,
  } = props;

  const { currentPage, paginatedRows, totalPages, goToPage } =
    useLocalPagination(rows, rowsPerPage);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-8 bg-gray-100 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-sm rounded-xl p-6 gap-4 relative overflow-hidden">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
              <div className="bg-white p-4 rounded-full shadow-lg border flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-gray-700">{tableTitle}</h2>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Opacity Wrapper */}
            <div
              className={`flex-1 flex flex-col ${
                isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <DataTable<RowType>
                columns={columns}
                data={paginatedRows}
                getRowId={(row) => row.propertyID}
                noDataMessage="No properties found."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Pagination */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-4 px-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

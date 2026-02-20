"use client";

import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { useLocalPagination } from "@/hooks/useLocalPagination";

interface LocalPaginatedTableProps<RowType extends object> {
  tableTitle: string;
  columns: Column<RowType>[];
  rows: RowType[];
  getRowId: (row: RowType) => string;
  noDataMessage?: string;
  isLoading?: boolean;
  rowsPerPage?: number;
}

export function LocalPaginatedTable<RowType extends object>(
  props: LocalPaginatedTableProps<RowType>,
) {
  const {
    tableTitle,
    columns,
    rows,
    getRowId,
    noDataMessage = "No data found.",
    isLoading = false,
    rowsPerPage = 10,
  } = props;

  const { currentPage, paginatedRows, totalPages, goToPage } =
    useLocalPagination(rows, rowsPerPage);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-8 bg-gray-100 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-sm rounded-xl p-2 gap-2 relative overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl font-medium text-gray-700">{tableTitle}</h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {/* Table Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <DataTable<RowType>
              columns={columns}
              data={paginatedRows}
              getRowId={getRowId}
              noDataMessage={noDataMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Pagination */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-4 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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

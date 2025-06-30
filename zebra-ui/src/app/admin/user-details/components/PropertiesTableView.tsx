"use client";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useLocalPagination } from "@/hooks/useLocalPagination";

interface PropertiesTableViewProps<
  RowType extends { propertyID: string; _serial: number },
> {
  tableTitle: string;
  columns: Column<RowType>[];
  rows: RowType[];
  rowsPerPage?: number;
}

export function PropertiesTableView<
  RowType extends { propertyID: string; _serial: number },
>(props: PropertiesTableViewProps<RowType>) {
  const { tableTitle, columns, rows, rowsPerPage = 10 } = props;
  const {
    currentPage,
    paginatedRows,
    totalPages,
    isFirst,
    isLast,
    goToPage,
    nextPage,
    prevPage,
  } = useLocalPagination(rows, rowsPerPage);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-100 flex-1 py-8 px-16">
          <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4 h-full">
            <h2 className="text-3xl">{tableTitle}</h2>
            <DataTable<RowType>
              columns={columns}
              data={paginatedRows}
              getRowId={(row) => row.propertyID}
            />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
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
}

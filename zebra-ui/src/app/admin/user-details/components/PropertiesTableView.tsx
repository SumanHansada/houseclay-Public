"use client";
import React, { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";

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
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage >= totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

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

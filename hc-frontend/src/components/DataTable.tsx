"use client";

import React from "react";

export interface Column<T> {
  key: string;
  label: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId?: (item: T, index: number) => string;
  noDataMessage?: string;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
}

function hasStringOrNumberId(obj: unknown): obj is { id: string | number } {
  if (typeof obj !== "object" || obj === null) return false;
  if (!("id" in obj)) return false;
  const idValue = (obj as { id: unknown }).id;
  return typeof idValue === "string" || typeof idValue === "number";
}

export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  noDataMessage = "No data found",
  className = "",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={`w-full bg-white ${className}`}>
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left text-gray-500 py-2 px-4 tracking-wide border-r last:border-r-0 ${
                  column.className || ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => {
              let fallbackId = rowIndex.toString();
              if (hasStringOrNumberId(item)) {
                fallbackId = String(item.id);
              }
              const rowId = getRowId ? getRowId(item, rowIndex) : fallbackId;

              return (
                <tr
                  key={rowId}
                  className={`bg-gray-50 ${
                    onRowClick ? "cursor-pointer hover:bg-gray-100" : ""
                  } transition-colors`}
                  onClick={
                    onRowClick ? () => onRowClick(item, rowIndex) : undefined
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="relative px-3 py-5 text-gray-700 align-middle shadow-sm first:rounded-l-xl last:rounded-r-xl after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3/5 after:w-px after:bg-gray-200 last:after:hidden"
                    >
                      {column.render
                        ? column.render(item)
                        : column.accessor
                          ? (item[column.accessor] as React.ReactNode)
                          : null}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-16 text-lg text-gray-500"
              >
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

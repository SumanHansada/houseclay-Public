"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React from "react";

import Spinner from "./Spinner";

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
  isLoading?: boolean;
}

function hasStringOrNumberId(obj: unknown): obj is { id: string | number } {
  if (typeof obj !== "object" || obj === null) return false;
  if (!("id" in obj)) return false;

  const idValue = (obj as { id: unknown }).id;
  return typeof idValue === "string" || typeof idValue === "number";
}

/**
 * A responsive, flex-ready Data Table component designed to consume all available vertical space.
 *
 * @template T - The type of data displayed in the rows.
 *
 * @param {DataTableProps<T>} props - The component props.
 * @param {Column<T>[]} props.columns - Configuration for table columns.
 * @param {T[]} props.data - The array of data objects to display.
 * @param {function} [props.getRowId] - Optional accessor for unique row IDs. Defaults to `id` or index.
 * @param {string} [props.noDataMessage] - Message displayed when data array is empty.
 *
 * @remarks
 * **Layout Requirement:**
 * This component is designed to fill its parent container.
 * The parent **MUST** be a Flex container with a defined height or `flex-1`.
 *
 * @example
 * // Correct Usage:
 * <div className="flex-1 flex flex-col overflow-hidden">
 * <DataTable columns={cols} data={data} />
 * </div>
 */
export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  noDataMessage = "No data found",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    // SCROLL CONTAINER - Fills available space and allows internal scrolling
    <div className="flex-1 w-full min-h-0 relative z-0">
      {/* INTERNAL LOADING OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 pointer-events-none">
          <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100 flex items-center justify-center">
            <Spinner size="md" />
          </div>
        </div>
      )}

      <Table
        aria-label="Data table"
        isHeaderSticky
        classNames={{
          base: "h-full z-0 overflow-hidden",
          wrapper:
            "h-full max-h-none shadow-none border border-gray-200 p-0 rounded-lg scrollbar-thin dataTableWrapper",
          th: [
            "bg-gray-50",
            "text-lg font-medium text-left text-gray-600",
            "border border-gray-200",
            "py-2 px-4",
            "h-12",
            "z-20",
          ].join(" "),
          td: "py-1 px-4 border border-gray-100 group-hover:bg-gray-50",
        }}
      >
        <TableHeader columns={columns}>
          {(col) => (
            <TableColumn key={col.key} className={col.className}>
              {col.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={data}
          emptyContent={
            !isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-red-400">
                <p className="text-2xl font-medium">{noDataMessage}</p>
              </div>
            ) : null
          }
        >
          {(item) => {
            let fallbackId = Math.random().toString(36);
            if (hasStringOrNumberId(item)) {
              fallbackId = String(item.id);
            }
            const rowId = getRowId ? getRowId(item, 0) : fallbackId;
            return (
              <TableRow
                key={rowId}
                className="hover:bg-gray-50 transition-colors"
              >
                {(columnKey) => (
                  <TableCell className="font-light text-gray-700">
                    {(() => {
                      const colDef = columns.find(
                        (col) => col.key === columnKey,
                      );
                      if (!colDef) return null;

                      if (colDef.render) return colDef.render(item);
                      if (colDef.accessor)
                        return item[colDef.accessor] as React.ReactNode;
                      return null;
                    })()}
                  </TableCell>
                )}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}

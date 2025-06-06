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
}: DataTableProps<T>) {
  return (
    <Table
      aria-label="Data table"
      className="w-full bg-white h-full"
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(col) => (
          <TableColumn
            key={col.key}
            className={`${col.className} text-left text-[22px] font-bold`}
          >
            {col.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody className="flex flex-col items-center justify-center h-full">
        {data.length > 0 ? (
          data.map((item, rowIndex) => {
            // const rowId =
            //   getRowId?.(item, rowIndex) ??
            //   (typeof (item as any).id === "string"
            //     ? ((item as any).id as string)
            //     : rowIndex.toString());

            let fallbackId = rowIndex.toString();
            if (hasStringOrNumberId(item)) {
              fallbackId = String(item.id);
            }
            const rowId = getRowId ? getRowId(item, rowIndex) : fallbackId;

            return (
              <TableRow
                key={rowId}
                className={
                  rowIndex % 2 === 1
                    ? "bg-gray-100"
                    : "bg-gray-50 border border-gray-200"
                }
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className="px-2 py-px">
                    {col.render
                      ? col.render(item)
                      : col.accessor
                        ? (item[col.accessor] as React.ReactNode)
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="pt-20 text-2xl text-center text-red-400"
            >
              No data found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

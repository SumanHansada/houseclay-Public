"use client";
import React from "react";

export interface Column<T> {
  key: string;
  label: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
}

export interface TableVariant {
  // Container styling
  containerClassName?: string;
  tableClassName?: string;

  // Header styling
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;

  // Body styling
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;

  // Alternate row styling
  evenRowClassName?: string;
  oddRowClassName?: string;

  // Hover effects
  rowHoverClassName?: string;

  // Empty state styling
  emptyStateClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId?: (item: T, index: number) => string;
  noDataMessage?: string;
  variant?: TableVariant;
  onRowClick?: (item: T, index: number) => void;
  onSort?: (columnKey: string, direction: "asc" | "desc") => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  className?: string;
  ariaLabel?: string;
}

// Pre-defined variants
export const TABLE_VARIANTS = {
  admin: {
    containerClassName: "w-full bg-white",
    tableClassName: "w-full border-collapse",
    headerClassName: "",
    headerRowClassName: "",
    headerCellClassName:
      "text-left text-lg font-normal border border-gray-200 py-3 px-4 bg-gray-50",
    bodyClassName: "",
    rowClassName: "border-b border-gray-200 hover:bg-gray-50 transition-colors",
    cellClassName: "px-4 py-3 border border-gray-200 font-light text-lg",
    emptyStateClassName: "text-center py-20 text-2xl text-red-400",
  } as TableVariant,

  website: {
    containerClassName: "w-full bg-white",
    tableClassName: "w-full border-separate border-spacing-y-3",
    headerClassName: "",
    headerRowClassName: "",
    headerCellClassName:
      "text-left text-gray-500 py-2 px-4 tracking-wide border-r last:border-r-0",
    bodyClassName: "",
    rowClassName: "bg-gray-50",
    cellClassName: [
      "relative px-3 py-5 text-gray-700 align-middle shadow-sm",
      "first:rounded-l-xl last:rounded-r-xl",
      "after:content-[''] after:absolute after:right-0 after:top-1/2",
      "after:-translate-y-1/2 after:h-[60%] after:w-px after:bg-gray-200 last:after:hidden",
    ].join(" "),
    emptyStateClassName: "text-center py-16 text-lg text-gray-500",
  } as TableVariant,

  minimal: {
    containerClassName: "w-full",
    tableClassName: "w-full",
    headerClassName: "",
    headerRowClassName: "",
    headerCellClassName:
      "text-left text-sm font-semibold text-gray-700 py-3 px-4 border-b-2 border-gray-200",
    bodyClassName: "",
    rowClassName: "hover:bg-gray-25 transition-colors",
    cellClassName: "px-4 py-3 text-sm text-gray-800 border-b border-gray-100",
    emptyStateClassName: "text-center py-12 text-base text-gray-400",
  } as TableVariant,
} as const;

function hasStringOrNumberId(obj: unknown): obj is { id: string | number } {
  if (typeof obj !== "object" || obj === null) return false;
  if (!("id" in obj)) return false;

  const idValue = (obj as { id: unknown }).id;
  return typeof idValue === "string" || typeof idValue === "number";
}

function combineClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function EnhancedDataTable<T extends object>({
  columns,
  data,
  getRowId,
  noDataMessage = "No data found",
  variant = TABLE_VARIANTS.website,
  onRowClick,
  onSort,
  sortColumn,
  sortDirection,
  className,
  ariaLabel = "Data table",
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    const newDirection =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
    onSort(columnKey, newDirection);
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <span className="ml-2 text-gray-400">↕</span>;
    }
    return <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className={combineClasses(variant.containerClassName, className)}>
      <table className={variant.tableClassName} aria-label={ariaLabel}>
        <thead className={variant.headerClassName}>
          <tr className={variant.headerRowClassName}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={combineClasses(
                  variant.headerCellClassName,
                  col.headerClassName,
                  col.sortable && onSort ? "cursor-pointer select-none" : "",
                )}
                onClick={
                  col.sortable && onSort ? () => handleSort(col.key) : undefined
                }
              >
                <div className="flex items-center">
                  {col.label}
                  {col.sortable && onSort && renderSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={variant.bodyClassName}>
          {data.length > 0 ? (
            data.map((item, rowIndex) => {
              let fallbackId = rowIndex.toString();
              if (hasStringOrNumberId(item)) {
                fallbackId = String(item.id);
              }
              const rowId = getRowId ? getRowId(item, rowIndex) : fallbackId;

              const isEven = rowIndex % 2 === 0;
              const rowClassName = combineClasses(
                variant.rowClassName,
                isEven ? variant.evenRowClassName : variant.oddRowClassName,
                variant.rowHoverClassName,
                onRowClick ? "cursor-pointer" : "",
              );

              return (
                <tr
                  key={rowId}
                  className={rowClassName}
                  onClick={
                    onRowClick ? () => onRowClick(item, rowIndex) : undefined
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={combineClasses(
                        variant.cellClassName,
                        col.cellClassName,
                      )}
                    >
                      {col.render
                        ? col.render(item)
                        : col.accessor
                          ? (item[col.accessor] as React.ReactNode)
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
                className={variant.emptyStateClassName}
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

// Wrapper components for specific use cases
export function AdminDataTable<T extends object>(
  props: Omit<DataTableProps<T>, "variant">,
) {
  return <EnhancedDataTable {...props} variant={TABLE_VARIANTS.admin} />;
}

export function WebsiteDataTable<T extends object>(
  props: Omit<DataTableProps<T>, "variant">,
) {
  return <EnhancedDataTable {...props} variant={TABLE_VARIANTS.website} />;
}

export function MinimalDataTable<T extends object>(
  props: Omit<DataTableProps<T>, "variant">,
) {
  return <EnhancedDataTable {...props} variant={TABLE_VARIANTS.minimal} />;
}

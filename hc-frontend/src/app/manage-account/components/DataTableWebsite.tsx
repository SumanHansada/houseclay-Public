// src/components/DataTableWebsite.tsx
"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

type Align = "left" | "center" | "right";

export type DataTableColumn<T extends object> = {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  align?: Align;
  title?: string;
};

export type DataTableWebsiteProps<T extends object> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  ariaLabel?: string;
  dense?: boolean;
  className?: string;
};

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function DataTableWebsite<T extends object>({
  rows,
  columns,
  getRowId,
  onRowClick,
  emptyMessage = "No data found",
  ariaLabel = "Data table",
  dense = false,
  className,
}: DataTableWebsiteProps<T>) {
  const cellPadding = dense ? "px-3 py-3" : "px-4 py-5";

  // Build an index map so we can recover "index" inside the (item) => ... render-prop
  const indexMap = useMemo(() => {
    const m = new WeakMap<object, number>();
    rows.forEach((r, i) => m.set(r as object, i));
    return m;
  }, [rows]);

  return (
    <div className={cn("w-full bg-white", className)}>
      <Table
        aria-label={ariaLabel}
        removeWrapper
        classNames={{
          table: "w-full border-separate border-spacing-y-3",
          th: "text-left text-gray-500 tracking-wide",
          tr: "bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors",
          td: cn(
            "align-middle shadow-sm text-gray-800",
            "first:rounded-l-xl last:rounded-r-xl",
          ),
        }}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn
              key={String(col.key)}
              className={cn(
                "py-2 px-4 text-sm font-medium",
                col.align === "center" && "text-center",
                col.align === "right" && "text-right",
              )}
              title={col.title}
            >
              {col.header}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody
          items={rows}
          emptyContent={
            <div className="py-12 text-gray-500">{emptyMessage}</div>
          }
        >
          {(item: T) => {
            const index = indexMap.get(item as object) ?? 0;
            const fallbackId =
              (item as any)?.id != null
                ? String((item as any).id)
                : String(index);
            const rowId = getRowId ? getRowId(item, index) : fallbackId;

            return (
              <TableRow
                key={rowId}
                onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => {
                  const content =
                    col.cell != null
                      ? col.cell(item)
                      : ((item as any)[col.key as keyof T] ?? null);

                  return (
                    <TableCell
                      key={String(col.key)}
                      className={cn(
                        cellPadding,
                        col.className,
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        "relative",
                        "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-px after:bg-gray-200 last:after:hidden",
                      )}
                    >
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTableWebsite;

// "use client";

// import React from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@heroui/react";

// type Align = "left" | "center" | "right";

// export type DataTableColumn<T> = {
//   /** Unique key; if it matches a key of T and no cell() is provided, we'll render row[key] */
//   key: keyof T | string;
//   header: string;
//   /** Optional custom renderer */
//   cell?: (row: T) => React.ReactNode;
//   /** Tailwind per-cell classes (kept minimal) */
//   className?: string;
//   /** Text alignment hint */
//   align?: Align;
//   /** Header title attribute */
//   title?: string;
// };

// export type DataTableWebsiteProps<T> = {
//   rows: T[];
//   columns: DataTableColumn<T>[];
//   /** Stable row id; defaults to index */
//   getRowId?: (row: T, index: number) => string;
//   /** Row click */
//   onRowClick?: (row: T, index: number) => void;
//   /** Empty state copy */
//   emptyMessage?: string;
//   /** ARIA label for a11y */
//   ariaLabel?: string;
//   /** Compact density */
//   dense?: boolean;
//   /** Table wrapper classes */
//   className?: string;
// };

// function cn(...parts: Array<string | undefined | false>) {
//   return parts.filter(Boolean).join(" ");
// }

// export function DataTableWebsite<T>({
//   rows,
//   columns,
//   getRowId,
//   onRowClick,
//   emptyMessage = "No data found",
//   ariaLabel = "Data table",
//   dense = false,
//   className,
// }: DataTableWebsiteProps<T>) {
//   const cellPadding = dense ? "px-3 py-3" : "px-4 py-5";

//   return (
//     <div className={cn("w-full bg-white", className)}>
//       <Table
//         aria-label={ariaLabel}
//         removeWrapper
//         classNames={{
//           table: "w-full border-separate border-spacing-y-3",
//           thead: "",
//           th: "text-left text-gray-500 tracking-wide",
//           tbody: "",
//           tr: cn(
//             "bg-gray-50 rounded-xl",
//             "hover:bg-gray-100 transition-colors",
//           ),
//           td: cn(
//             "align-middle shadow-sm text-gray-800",
//             "first:rounded-l-xl last:rounded-r-xl",
//           ),
//         }}
//       >
//         <TableHeader>
//           {columns.map((col) => (
//             <TableColumn
//               key={String(col.key)}
//               className={cn(
//                 "py-2 px-4 text-sm font-medium",
//                 col.align === "center" && "text-center",
//                 col.align === "right" && "text-right",
//               )}
//               title={col.title}
//             >
//               {col.header}
//             </TableColumn>
//           ))}
//         </TableHeader>

//         <TableBody
//           emptyContent={
//             <div className="py-12 text-gray-500">{emptyMessage}</div>
//           }
//           items={rows}
//         >
//           {(item: T, index: number) => {
//             const id =
//               getRowId?.(item, index) ??
//               (typeof (item as any)?.id !== "undefined"
//                 ? String((item as any).id)
//                 : String(index));

//             return (
//               <TableRow
//                 key={id}
//                 onClick={onRowClick ? () => onRowClick(item, index) : undefined}
//                 className={cn(onRowClick && "cursor-pointer")}
//               >
//                 {columns.map((col) => {
//                   const content = col.cell
//                     ? col.cell(item)
//                     : ((item as any)[col.key as keyof T] ?? null);

//                   return (
//                     <TableCell
//                       key={String(col.key)}
//                       className={cn(
//                         cellPadding,
//                         col.className,
//                         col.align === "center" && "text-center",
//                         col.align === "right" && "text-right",
//                         // vertical separators (subtle), skipped for last cell
//                         "relative",
//                         "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-px after:bg-gray-200 last:after:hidden",
//                       )}
//                     >
//                       {content}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             );
//           }}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default DataTableWebsite;

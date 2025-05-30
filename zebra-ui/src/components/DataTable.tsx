"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

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
            const rowId =
              getRowId?.(item, rowIndex) ??
              (typeof (item as any).id === "string"
                ? ((item as any).id as string)
                : rowIndex.toString());

            return (
              <TableRow
                key={rowId}
                className={
                  rowIndex % 2 === 1
                    ? "bg-gray-200"
                    : "bg-gray-50 border border-gray-300"
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

// "use client";

// import React from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@heroui/table";

// export interface Column<T> {
//   key: keyof T;
//   label: string;
// }

// export interface DataTableProps<T> {
//   columns: Column<T>[];
//   data: T[];
//   renderCell: (item: T, columnKey: keyof T) => React.ReactNode;
// }

// export function DataTable<T extends Record<string, any>>({
//   columns,
//   data,
//   renderCell,
// }: DataTableProps<T>) {
//   return (
//     <Table
//       aria-label="User table"
//       className="w-full bg-white h-full"
//       removeWrapper
//     >
//       <TableHeader columns={columns}>
//         {(column) => (
//           <TableColumn
//             key={String(column.key)}
//             className="text-left text-lg font-bold"
//           >
//             {column.label}
//           </TableColumn>
//         )}
//       </TableHeader>

//       <TableBody className="flex flex-col items-center justify-center h-full">
//         {data.length > 0 ? (
//           data.map((item, rowIndex) => (
//             <TableRow
//               key={String((item as any).id ?? rowIndex)}
//               className={`${rowIndex % 2 === 1 ? "bg-gray-200" : "bg-gray-50 border border-gray-300"}`}
//             >
//               {(columnKey) => (
//                 <TableCell className="px-2 py-px">
//                   {renderCell(item, columnKey as keyof T)}
//                 </TableCell>
//               )}
//             </TableRow>
//           ))
//         ) : (
//           <TableRow>
//             <TableCell
//               colSpan={columns.length}
//               className="pt-20 text-2xl text-center text-red-400"
//             >
//               No users found
//             </TableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }

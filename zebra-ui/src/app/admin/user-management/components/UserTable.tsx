"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { TUser } from "./Types";

interface UserTableProps {
  columns: { key: string; label: string }[];
  paged: TUser[];
  renderCell: (user: TUser, columnKey: string) => React.ReactNode;
}

export default function UserTable({
  columns,
  paged,
  renderCell,
}: UserTableProps) {
  return (
    <Table
      aria-label="User table"
      className="w-full bg-white h-full"
      removeWrapper
    >
      <TableHeader columns={columns} className="">
        {(col) => (
          <TableColumn key={col.key} className="text-left text-lg font-bold">
            {col.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody className="flex flex-col items-center justify-center h-full">
        {paged.length > 0 ? (
          paged.map((user, rowIndex) => (
            <TableRow
              key={user.id}
              className={`${rowIndex % 2 === 1 ? "bg-gray-200" : "bg-gray-50 border border-gray-300"}`}
            >
              {(columnKey) => (
                <TableCell className="px-2 py-px">
                  {renderCell(user, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="pt-20 text-2xl text-center text-red-400"
            >
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

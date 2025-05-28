"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { TBlockFilter } from "./SearchFilterBar";
import { TUser } from "./UserManagement";

interface UserTableProps {
  columns: { key: string; label: string }[];
  paged: TUser[];
  renderCell: (user: TUser, columnKey: string) => React.ReactNode;
  blockFilter: TBlockFilter;
}

export default function UserTable({
  columns,
  paged,
  renderCell,
  blockFilter,
}: UserTableProps) {
  return (
    <Table
      aria-label="User table"
      className="w-full bg-white rounded-md shadow-xl min-h-[350px]"
    >
      <TableHeader columns={columns} className="">
        {(col) => (
          <TableColumn key={col.key} className="py-2 text-left">
            {col.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody>
        {paged.length > 0 ? (
          paged.map((user) => (
            <TableRow
              key={user.id}
              className={
                user.blacklisted && blockFilter === "all" ? "opacity-60" : ""
              }
            >
              {(columnKey) => (
                <TableCell className="px-2 py-px border-b border-b-red-500">
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

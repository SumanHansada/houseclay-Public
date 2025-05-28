"use client";

import React, { useState, useMemo } from "react";
import { SearchFilterBar, TBlockFilter } from "./SearchFilterBar";
// import { SearchFilterBar } from "./SearchFilterBar";
import { Pagination } from "./Pagination";
import UserTable from "./UserTable";
import { getKeyValue } from "@heroui/table";
import { UserCard } from "./UserCard";
import { ActionMenu } from "./ActionMenu";

interface UsersManagementProps {
  users: TUser[];
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  avatar: string;
  blacklisted: boolean;
  connectBalance: number;
};

const rawColumns = [
  { key: "name", label: "Name" },
  { key: "phoneNo", label: "Phone No." },
  { key: "connectBalance", label: "Connect Balance" },
];

export const UsersManagement = ({ users }: UsersManagementProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [blockFilter, setBlockFilter] = useState<TBlockFilter>("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const columns = useMemo(
    () => [
      // ...rawColumns.filter((c) => c.key !== "email"),
      ...rawColumns,
      { key: "actions", label: "Actions" },
    ],
    [],
  );

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch = user.phoneNo.includes(searchValue);
        const matchesBlock =
          blockFilter === "all"
            ? true
            : blockFilter === "blocked"
              ? user.blacklisted
              : !user.blacklisted;
        return matchesSearch && matchesBlock;
        // return matchesSearch;
      }),
    [users, searchValue, blockFilter],
    // [users, searchValue],
  );

  const renderCell = (user: TUser, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <UserCard avatar={user.avatar} name={user.name} email={user.email} />
        );
      case "phoneNo":
        return <div className="px-1">{user.phoneNo}</div>;
      case "connectBalance":
        return <div className="px-2">{user.connectBalance}</div>;
      case "actions":
        return <ActionMenu offsetX={14} offsetY={-7} />;
      default:
        return (
          <div className="flex justify-start">
            {getKeyValue(user, columnKey)}
          </div>
        );
    }
  };

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const isFirst = page === 1;
  const isLast = page === totalPages;

  const nextPage = () => !isLast && setPage((p) => p + 1);
  const prevPage = () => !isFirst && setPage((p) => p - 1);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full bg-gray-100">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={(v) => {
              setSearchValue(v);
              setPage(1);
            }}
            blockFilter={blockFilter}
            onBlockFilterChange={(v) => {
              setBlockFilter(v);
              setPage(1);
            }}
          />
        </div>

        {/* Table area */}
        <div className="flex items-center flex-1 overflow-auto px-28">
          <UserTable
            columns={columns}
            paged={paged}
            renderCell={renderCell}
            blockFilter={blockFilter}
          />
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 bg-white shadow px-28">
          <Pagination
            currentPage={page}
            isFirst={isFirst}
            isLast={isLast}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
};

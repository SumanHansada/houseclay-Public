"use client";

import React, { useState, useMemo } from "react";
import { SearchFilterBar } from "./SearchFilterBar";
import { Pagination } from "./Pagination";
import { UserCard } from "./UserCard";
import { ActionMenu } from "./ActionMenu";
import { UserStatus } from "./UserStatus";
import { useRouter } from "next/navigation";
import { TUser } from "@/common/Types";
import { Column, DataTable } from "@/components/DataTable";

interface UsersManagementProps {
  users: TUser[];
}

export const UsersManagement = ({ users }: UsersManagementProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const router = useRouter();

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch = user.phoneNo.includes(searchValue);
        return matchesSearch;
      }),
    [users, searchValue],
  );

  const viewProfile = (id: string) => {
    router.push(`/admin/user-details/${id}`);
  };

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const isFirst = page === 1;
  const isLast = page === totalPages;

  const nextPage = () => !isLast && setPage((p) => p + 1);
  const prevPage = () => !isFirst && setPage((p) => p - 1);

  const columns: Column<TUser>[] = [
    {
      key: "name",
      label: "Name",
      render: (user) => (
        <UserCard avatar={user.avatar} name={user.name} email={user.email} />
      ),
    },
    {
      key: "phoneNo",
      label: "Phone No.",
      accessor: "phoneNo",
    },
    {
      key: "blacklisted",
      label: "Status",
      render: (user) => <UserStatus isBlacklisted={user.blacklisted} />,
    },
    {
      key: "action",
      label: "Action",
      render: (user) => <ActionMenu viewProfile={() => viewProfile(user.id)} />,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm">
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={(v) => {
              setSearchValue(v);
              setPage(1);
            }}
          />
        </div>

        {/* Table area */}
        <div className="flex items-center flex-1 overflow-auto px-4">
          <DataTable
            columns={columns}
            data={paged}
            getRowId={(user) => user.id}
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

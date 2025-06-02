"use client";

import React, { useState, useMemo } from "react";
import { SearchFilterBar } from "./SearchFilterBar";
import { Pagination } from "./Pagination";
import { UserCard } from "./UserCard";
import { ActionMenu } from "./ActionMenu";
import { UserStatus } from "./UserStatus";
import { useRouter } from "next/navigation";
import { TUser } from "@/interfaces/User";
import { Column, DataTable } from "@/components/DataTable";
import { useGetUsersQuery } from "@/store/apiSlice";

export const UsersManagement = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  const { data, isLoading, isError, error } = useGetUsersQuery({
    page: currentPage - 1,
    size: rowsPerPage,
  });

  const allUsers: TUser[] = data?.content ?? [];
  console.log(allUsers);
  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  const filtered = useMemo(
    () =>
      allUsers.filter((user) =>
        user.phoneNo.includes(searchValue.toLowerCase()),
      ),
    [allUsers, searchValue],
  );

  const viewProfile = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };

  // const totalPages = Math.ceil(filtered.length / rowsPerPage);
  // const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // const isFirst = page === 1;
  // const isLast = page === totalPages;
  // 6) Handle loading / error states

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading users…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <span>Error loading users.</span>
      </div>
    );
  }
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

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
      render: (user) => (
        <ActionMenu viewProfile={() => viewProfile(user.phoneNo)} />
      ),
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
            }}
          />
        </div>

        {/* Table area */}
        <div className="flex items-center flex-1 overflow-auto px-8">
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(user) => user.phoneNo}
          />
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-b-gray-200 shadow-sm">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            isFirst={isFirst}
            isLast={isLast}
            goToPage={goToPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
};

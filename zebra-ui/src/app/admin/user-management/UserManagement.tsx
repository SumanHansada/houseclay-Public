"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { TablePagination } from "@/components/TablePagination";
import { User } from "@/interfaces/User";
import { useGetUsersQuery } from "@/store/apiSlice";

import { RenderUserStatus } from "./components/RenderUserStatus";
import { TableCellActions } from "./components/TableCellActions";

export const UsersManagement = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useGetUsersQuery({
    page: currentPage - 1,
    size: rowsPerPage,
  });

  const allUsers = useMemo<User[]>(() => {
    return data?.content ?? [];
  }, [data?.content]);

  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  const viewProfile = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };

  const filteredUsers = useMemo(
    () =>
      allUsers.filter((user) =>
        user.phoneNo.includes(searchValue.toLowerCase()),
      ),
    [allUsers, searchValue],
  );

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

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      accessor: "name",
    },
    {
      key: "email",
      label: "Email",
      accessor: "email",
    },
    {
      key: "phoneNo",
      label: "Phone No.",
      accessor: "phoneNo",
    },
    {
      key: "blacklisted",
      label: "Status",
      render: (user) => <RenderUserStatus isBlacklisted={user.blacklisted} />,
    },
    {
      key: "action",
      label: "Action",
      render: (user) => (
        <TableCellActions viewProfile={() => viewProfile(user.phoneNo)} />
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
            title={"HouseClay Users - DataTable"}
          />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-6 px-16">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4">
            <DataTable
              columns={columns}
              data={filteredUsers}
              getRowId={(user) => user.phoneNo}
            />
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
          <TablePagination
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

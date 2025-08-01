"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { PaginationFooter } from "@/components/PaginationFooter";
import { RenderUserStatus } from "@/components/status/RenderUserStatus";
import { TitleAndSearchBar } from "@/components/TitleAndSearchBar";
import { UserInfo } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery, useGetUsersQuery } from "@/store/apiSlice";
import { createTestIdFactory } from "@/utils/testIds";

const ROWS_PER_PAGE = 10;
const userManagementTestIds = createTestIdFactory("User Management");

export const UsersManagement = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState<UserInfo | null>(null);

  const {
    data: paginatedUserData,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery(
    {
      page: currentPage - 1,
      size: ROWS_PER_PAGE,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: currentUser,
    isFetching: isSearching,
    isError: isSearchError,
  } = useGetUserByPhoneNoQuery(
    {
      phoneNo: searchValue,
    },
    {
      skip: !searchValue,
    },
  );

  useEffect(() => {
    if (currentUser) {
      const { name, email, phoneNo, blacklisted } = currentUser.user;
      setSearchResult({ name, email, phoneNo, blacklisted });
    } else if (!isSearching && searchValue) {
      setSearchResult(null);
    }
  }, [currentUser, isSearching, searchValue]);

  if (isSearching || isLoading || isError || !paginatedUserData) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || isSearchError || !paginatedUserData}
        error={error}
        loadingMessage="Loading all users…"
        errorMessage="Failed to fetch Users."
      />
    );
  }

  const {
    content: allUsers,
    totalPages,
    first: isFirst,
    last: isLast,
  } = paginatedUserData;

  const filteredUsers = searchValue
    ? searchResult
      ? [searchResult]
      : []
    : allUsers;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const viewProfile = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    if (searchText) {
      setSearchValue(searchText.trim());
    } else {
      setSearchValue("");
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchValue("");
    setSearchResult(null);
  };

  const columns: Column<UserInfo>[] = [
    { key: "name", label: "Name", accessor: "name" },
    { key: "email", label: "Email", accessor: "email" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "blacklisted",
      label: "Status",
      render: (user) => <RenderUserStatus isBlacklisted={user.blacklisted} />,
    },
    {
      key: "action",
      label: "Action",
      render: (user) => (
        <IconButtonWithTooltip
          onClick={() => viewProfile(user.phoneNo)}
          Icon={Eye}
          tooltipActive={true}
          tooltip="View Profile"
          testId={userManagementTestIds.genericId("view profile", user.phoneNo)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm">
          <TitleAndSearchBar
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onSearch={handleSearchClick}
            onClear={handleClearSearch}
            isSearching={isSearching}
            title={"HouseClay Users - DataTable"}
          />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-8 px-16">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-6">
            <DataTable
              columns={columns}
              data={filteredUsers}
              getRowId={(user) => user.phoneNo}
              noDataMessage={
                searchValue && !searchResult && !isSearching
                  ? "No such user exists."
                  : "No User Data Found!"
              }
            />
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
          <PaginationFooter
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

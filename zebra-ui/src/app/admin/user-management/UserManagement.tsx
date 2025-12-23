"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import Spinner from "@/components/Spinner";
import { RenderUserStatus } from "@/components/status/RenderUserStatus";
import { UserInfo } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery, useGetUsersQuery } from "@/store/apiSlice";
import { createTestIdFactory } from "@/utils/testIds";

const ROWS_PER_PAGE = 12;
const userManagementTestIds = createTestIdFactory("User Management");

export const UsersManagement = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const isSearchMode = !!activeSearch;

  // Get All Users (Paginated)
  const {
    data: paginatedUserData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    isError: isListError,
    error: listError,
  } = useGetUsersQuery(
    {
      page: currentPage - 1,
      size: ROWS_PER_PAGE,
    },
    {
      skip: isSearchMode,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  // Search Single User
  const {
    data: searchUserData,
    isFetching: isSearchFetching,
    isError: isSearchError,
    error: searchError,
  } = useGetUserByPhoneNoQuery(
    { phoneNo: activeSearch },
    { skip: !isSearchMode },
  );

  // Derived Data
  let tableData: UserInfo[] = [];
  let totalPages = 0;

  // Loading and Fetching States
  let isGlobalLoading = false;
  let isGlobalFetching = false;

  // Error States
  let isGlobalError = false;
  let globalError: unknown = null;
  let globalErrorMessage = "";

  if (isSearchMode) {
    // --- Search Mode ---
    isGlobalLoading = false;
    isGlobalFetching = isSearchFetching;
    if (isSearchError) {
      isGlobalError = true;
      globalError = searchError;
      globalErrorMessage = "Failed to fetch user.";
      tableData = [];
      totalPages = 0;
    } else {
      tableData = searchUserData?.user ? [searchUserData.user] : [];
      totalPages = 1;
    }
  } else {
    // --- List Mode ---
    isGlobalLoading = isListLoading;
    isGlobalFetching = isListFetching;
    if (isListError || !paginatedUserData) {
      isGlobalError = true;
      globalError = listError;
      globalErrorMessage = "Failed to fetch Users.";
    } else {
      tableData = paginatedUserData?.content || [];
      totalPages = paginatedUserData?.totalPages || 0;
    }
  }

  // Reset page if out of bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSearchClick = () => {
    const term = searchText.trim();
    if (term) {
      setActiveSearch(term);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const viewProfile = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };

  // Columns Configuration
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

  // Initial Hard Loading State
  if (isGlobalLoading) {
    return (
      <AsyncFallback
        isLoading={true}
        isError={false}
        loadingMessage="Loading users..."
      />
    );
  }

  // Error State
  if (isGlobalError) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={globalError}
        errorMessage={globalErrorMessage}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center py-4 px-16">
          <h1 className="text-2xl font-medium">Houseclay Users</h1>
          <SearchBar
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onSearch={handleSearchClick}
            onClear={handleClearSearch}
            isSearching={isGlobalFetching}
          />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-8 px-16 overflow-hidden">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-6 relative overflow-hidden">
            {/* Loading Overlay */}
            {isGlobalFetching && (
              <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="bg-white p-4 rounded-full shadow-lg border flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto">
              <div
                className={
                  isGlobalFetching
                    ? "opacity-50 pointer-events-none"
                    : "opacity-100"
                }
              >
                <DataTable
                  columns={columns}
                  data={tableData}
                  getRowId={(user) => user.phoneNo}
                  noDataMessage={
                    isSearchMode
                      ? "No user found with that phone number."
                      : "No User Data Found!"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-16">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isGlobalFetching}
          />
        </div>
      </div>
    </div>
  );
};

"use client";

import { CirclePlus, Eye, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/base-components";
import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { Pill } from "@/components/Pill";
import { SearchBar } from "@/components/SearchBar";
import { AddNewHouseclayUserDialog } from "@/dialogs/add-new-houseclay-user-dialog";
import { UserInfo } from "@/interfaces/User";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetUserByPhoneNoQuery, useGetUsersQuery } from "@/store/apiSlice";

const ROWS_PER_PAGE = 12;
// const userManagementTestIds = createTestIdFactory("User Management");
const ADD_NEW_USER_DIALOG_ID = "add-new-houseclay-user-dialog";

export const ListAllUsersView = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const { isDialogOpen, openDialog } = useDialog();

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
  } = useGetUserByPhoneNoQuery(
    { phoneNo: activeSearch },
    { skip: !isSearchMode },
  );

  // Derived Data
  let tableData: (UserInfo & { _serial: number })[] = [];
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
      tableData = [];
      totalPages = 0;
    } else {
      const rawData = searchUserData?.user ? [searchUserData.user] : [];
      tableData = rawData.map((user, index) => ({
        ...user,
        _serial: index + 1,
      }));
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
      const rawData = paginatedUserData?.content || [];
      tableData = rawData.map((user, index) => ({
        ...user,
        _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
      }));
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

  const handleView = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };
  const handleAddProperty = (phoneNo: string) => {
    router.push(`/admin/list-property/${phoneNo}`);
  };

  // Columns Configuration
  const columns: Column<UserInfo & { _serial: number }>[] = [
    { key: "_serial", label: "#", accessor: "_serial" },
    { key: "name", label: "Name", accessor: "name" },
    { key: "email", label: "Email", accessor: "email" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "blacklisted",
      label: "Status",
      render: (user) =>
        user.blacklisted ? (
          <Pill color="red">Blacklisted</Pill>
        ) : (
          <Pill color="green">Active</Pill>
        ),
    },
    {
      key: "action",
      label: "Action",
      render: (user) => (
        <div className="flex items-center">
          <IconButtonWithTooltip
            onClick={() => handleAddProperty(user.phoneNo)}
            icon={PlusCircle}
            tooltip="Add Property for User"
            iconClassName="size-4 text-gray-600"
          />
          <IconButtonWithTooltip
            onClick={() => handleView(user.phoneNo)}
            icon={Eye}
            tooltip="View Profile"
          />
        </div>
      ),
    },
  ];

  const userCount = isSearchMode
    ? tableData.length
    : paginatedUserData?.totalElements || 0;

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
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky top filter bar */}
        <div className="h-16 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-8 py-4">
          <h1 className="text-2xl font-medium">User Management</h1>
          <div className="flex items-center gap-5">
            <SearchBar
              searchText={searchText}
              onSearchTextChange={setSearchText}
              onSearch={handleSearchClick}
              onClear={handleClearSearch}
              isSearching={isGlobalFetching}
            />
            <Button
              variant="primary"
              size="custom"
              className="rounded-full p-2 text-nowrap"
              onClick={() => openDialog(ADD_NEW_USER_DIALOG_ID)}
              leftIcon={<CirclePlus size={20} />}
            >
              Add new User
            </Button>
          </div>
        </div>

        {/* Table area */}
        <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
          <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
            <div className="px-1 flex justify-between items-center">
              <h1 className="text-xl font-medium">
                {isSearchMode && userCount === 0
                  ? "Houseclay Users - No results found"
                  : `Houseclay Users - [${userCount}]`}
              </h1>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <DataTable
                columns={columns}
                data={tableData}
                getRowId={(user) => user.phoneNo}
                noDataMessage={
                  isSearchMode
                    ? "No user found with that phone number."
                    : "No User Data Found!"
                }
                isLoading={isGlobalFetching}
              />
            </div>
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isGlobalFetching}
          />
        </div>
      </div>
      {isDialogOpen(ADD_NEW_USER_DIALOG_ID) && (
        <AddNewHouseclayUserDialog id={ADD_NEW_USER_DIALOG_ID} />
      )}
    </>
  );
};

"use client";

import { CirclePlus, Eye, PlusCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";

import { Button } from "@/base-components";
import { CorporateBenefitStatus } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { Pill } from "@/components/Pill";
import { SearchBar } from "@/components/SearchBar";
import { AddNewHouseclayUserDialog } from "@/dialogs/add-new-houseclay-user-dialog";
import { UserExtendedInfo } from "@/interfaces/User";
import { useDialog } from "@/providers/DialogContextProvider";
import { useGetUserByPhoneNoQuery, useGetUsersQuery } from "@/store/apiSlice";
import { formatDateVerbose } from "@/utils/core";

const ROWS_PER_PAGE = 12;
const ADD_NEW_USER_DIALOG_ID = "add-new-houseclay-user-dialog";

export const UsersTableView = ({
  currentPage,
  searchTerm,
}: {
  currentPage: number;
  searchTerm: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isDialogOpen, openDialog } = useDialog();
  const [isPending, startTransition] = useTransition();

  const [localSearchText, setLocalSearchText] = useState(searchTerm);

  // Sync local input if URL changes externally (e.g. Back Button)
  useEffect(() => {
    setLocalSearchText(searchTerm);
  }, [searchTerm]);

  // update URL
  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // If we are searching, always reset to page 1
      if (updates.search !== undefined) {
        params.set("page", "1");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  const handleSearchClick = () => {
    const term = localSearchText.trim();
    if (term != searchTerm) {
      updateURL({ search: term });
    }
  };

  const handleClearSearch = () => {
    setLocalSearchText("");
    updateURL({ search: null });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  const handleView = (phoneNo: string) => {
    router.push(`/admin/users/${phoneNo}/profile`);
  };

  const handleAddProperty = (phoneNo: string) => {
    router.push(`/admin/list-property/${phoneNo}`);
  };

  // ─── DATA FETCHING ───
  const isSearchMode = !!searchTerm;

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
    },
  );

  // Search Single User
  const {
    data: searchUserData,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useGetUserByPhoneNoQuery(
    { phoneNo: searchTerm },
    { skip: !isSearchMode },
  );

  // ─── DATA PROCESSING ───
  let tableData: (UserExtendedInfo & { _serial: number })[] = [];
  let totalPages = 0;

  // Loading/Error States
  let isGlobalLoading = false;
  let isGlobalFetching = isPending;
  let isGlobalError = false;
  let globalError: unknown = null;
  let globalErrorMessage = "";

  if (isSearchMode) {
    // --- Search Mode ---
    isGlobalLoading = false;
    isGlobalFetching = isSearchFetching || isPending;

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
    isGlobalFetching = isListFetching || isPending;

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
    if (
      !isSearchMode &&
      !isListLoading &&
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      updateURL({ page: "1" });
    }
  }, [totalPages, currentPage, isSearchMode, isListLoading, updateURL]);

  // Columns Configuration
  const columns: Column<UserExtendedInfo & { _serial: number }>[] = [
    { key: "_serial", label: "#", accessor: "_serial" },
    { key: "name", label: "Name", accessor: "name" },
    { key: "email", label: "Email", accessor: "email" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "corporateBenefitStatus",
      label: "Corporate Benefit",
      render: (user) => {
        const title =
          user.corporateBenefitStatus || CorporateBenefitStatus.NONE;
        let color: "green" | "red" | "yellow" | "gray" = "gray";
        if (title === CorporateBenefitStatus.APPROVED) color = "green";
        if (title === CorporateBenefitStatus.REJECTED) color = "red";
        if (title === CorporateBenefitStatus.PENDING_ADMIN_APPROVAL)
          color = "yellow";

        return <Pill color={color}>{title}</Pill>;
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (user) => formatDateVerbose(user.createdAt),
    },
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
              searchText={localSearchText}
              onSearchTextChange={setLocalSearchText}
              onSearch={handleSearchClick}
              onClear={handleClearSearch}
              isSearching={isGlobalFetching}
            />
            <Button
              size="custom"
              className="rounded-full text-nowrap px-3 py-1.5"
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
            <div className="flex justify-between items-center px-1">
              <h1 className="text-xl font-medium">
                {isSearchMode && userCount === 0
                  ? "Houseclay Users - No results found"
                  : `Houseclay Users - [${userCount}]`}
              </h1>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
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
            onPageChange={handlePageChange}
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

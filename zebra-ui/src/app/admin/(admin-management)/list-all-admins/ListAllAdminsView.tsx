"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { Pill } from "@/components/Pill";
import { AdminInfo } from "@/interfaces/Admin";
import { useGetAdminsQuery } from "@/store/apiSlice";
import { formatDateVerbose } from "@/utils/core";

interface SerializedAdminRow extends AdminInfo {
  _serial: number;
}

const ROWS_PER_PAGE = 12;

export const ListAllAdminsView = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Get All Admins (Paginated)
  const {
    data: paginatedAdminData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAdminsQuery(
    {
      page: currentPage - 1,
      size: ROWS_PER_PAGE,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    content: adminList = [],
    totalPages = 0,
    totalElements = 0,
  } = paginatedAdminData || {};

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Initial Hard Loading State
  if (isLoading) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={false}
        loadingMessage="Loading admins..."
      />
    );
  }

  // Error State
  if (isError || !paginatedAdminData) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch Admins."
      />
    );
  }

  const rows: SerializedAdminRow[] = adminList.map((adminInfo, index) => ({
    ...adminInfo,
    _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
  }));

  const viewProfile = (username: string) => {
    router.push(`/admin/admin-details/${username}`);
  };

  // Columns Configuration
  const columns: Column<SerializedAdminRow>[] = [
    { key: "_serial", label: "#", accessor: "_serial" },
    { key: "name", label: "Name", accessor: "name" },
    { key: "username", label: "Username", accessor: "username" },
    { key: "role", label: "Role", accessor: "role" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "dateOfJoining",
      label: "Date of Joining",
      render: (admin) => formatDateVerbose(admin.dateOfJoining),
    },
    {
      key: "active",
      label: "Status",
      render: (admin) =>
        admin.active ? (
          <Pill color="green">Active</Pill>
        ) : (
          <Pill color="gray">Inactive</Pill>
        ),
    },
    {
      key: "action",
      label: "Action",
      render: (admin) => (
        <IconButtonWithTooltip
          onClick={() => viewProfile(admin.username)}
          icon={Eye}
          tooltip="View Profile"
        />
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky top status title bar */}
      <div className="h-16 sticky top-0 z-10 bg-white border border-b-gray-200 shadow-sm px-8 py-4 flex items-center">
        <h1 className="text-2xl font-medium">Admin Management</h1>
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
          {/* Table Header */}
          <div className="px-1 flex justify-between items-center">
            <h1 className="text-xl font-medium">
              Houseclay - Zebra Users [{totalElements}]
            </h1>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(admin) => admin.username}
              noDataMessage="No admins found."
              isLoading={isFetching}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom pagination */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};

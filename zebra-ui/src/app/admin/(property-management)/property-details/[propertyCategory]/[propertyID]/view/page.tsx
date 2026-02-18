"use client";
import { Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { Pill } from "@/components/Pill";
import Spinner from "@/components/Spinner";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { UserInfo } from "@/interfaces/User";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";

const ROWS_PER_PAGE = 10;

export default function ViewUsersPage() {
  const router = useRouter();
  const { propertyID } = useParams() as { propertyID: string };

  const { data: currentProperty, isLoading } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const rows = currentProperty?.viewUsers ?? [];

  const { currentPage, paginatedRows, totalPages, goToPage } =
    useLocalPagination(rows, ROWS_PER_PAGE);

  const viewProfile = (phoneNo: string) =>
    router.push(`/admin/users/${phoneNo}`);

  const columns: Column<UserInfo>[] = [
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
      className: "w-24",
      render: (user) => (
        <IconButtonWithTooltip
          onClick={() => viewProfile(user.phoneNo)}
          icon={Eye}
          tooltip="View Profile"
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        {/* Main Content Area */}
        <div className="bg-gray-100 flex-1 p-8">
          <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col gap-4 h-full relative">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="bg-white p-4 rounded-full shadow-lg border flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-gray-700">View Users</h2>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Opacity Wrapper */}
              <div
                className={
                  isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
                }
              >
                <DataTable<UserInfo>
                  columns={columns}
                  data={paginatedRows}
                  getRowId={(row) => row.phoneNo}
                  noDataMessage="No users found."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-4 px-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => goToPage(page)}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
}

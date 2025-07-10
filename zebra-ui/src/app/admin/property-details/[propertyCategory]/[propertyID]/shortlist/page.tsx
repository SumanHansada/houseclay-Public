"use client";
import { Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { PaginationFooter } from "@/components/PaginationFooter";
import { RenderUserStatus } from "@/components/status/RenderUserStatus";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { UserInfo } from "@/interfaces/User";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";

export default function ShortlistUsersPage() {
  const router = useRouter();
  const { propertyID } = useParams() as { propertyID: string };
  const rowsPerPage = 10;
  const { data: currentProperty } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const rows = currentProperty!.shortlistUsers;

  const {
    currentPage,
    paginatedRows,
    totalPages,
    isFirst,
    isLast,
    goToPage,
    nextPage,
    prevPage,
  } = useLocalPagination(rows, rowsPerPage);

  const viewProfile = (phoneNo: string) =>
    router.push(`/admin/user-details/${phoneNo}`);

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
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col bg-gray-100 py-8 px-16">
        <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4 h-full">
          <h2 className="text-3xl">Shortlist Users</h2>
          <DataTable<UserInfo>
            columns={columns}
            data={paginatedRows}
            getRowId={(u) => u.phoneNo}
            noDataMessage="No users found"
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 border-t bg-white">
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
  );
}

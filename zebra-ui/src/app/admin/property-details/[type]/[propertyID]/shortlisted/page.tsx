"use client";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { PaginationFooter } from "@/components/PaginationFooter";
import { RenderUserStatus } from "@/components/user/RenderUserStatus";
import { User } from "@/interfaces/User";
import { dummyUserDataList } from "@/mock/userDetailsDummy";

export default function ShortlistedUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const shortlistedUsers: User[] = dummyUserDataList;

  const totalRows = shortlistedUsers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return shortlistedUsers.slice(start, start + rowsPerPage);
  }, [shortlistedUsers, currentPage]);

  const goToPage = (p: number) =>
    p >= 1 && p <= totalPages && setCurrentPage(p);
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const router = useRouter();
  const viewProfile = (phoneNo: string) =>
    router.push(`/admin/user-details/${phoneNo}`);

  const columns: Column<User>[] = [
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
          <h2 className="text-3xl">User Shortlisted</h2>
          <DataTable<User>
            columns={columns}
            data={paginatedRows}
            getRowId={(u) => u.phoneNo}
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

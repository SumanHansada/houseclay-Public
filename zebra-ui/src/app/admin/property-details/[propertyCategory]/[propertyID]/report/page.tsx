"use client";
import { Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { PropertyReportDetails } from "@/interfaces/api";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";

export default function ReportUsersPage() {
  const router = useRouter();
  const { propertyID } = useParams() as { propertyID: string };
  const rowsPerPage = 10;

  const { data: currentProperty } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const rows = currentProperty!.reportUsers;

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

  const columns: Column<PropertyReportDetails>[] = [
    {
      key: "name",
      label: "Name",
      render: (reportDetails) => <span>{reportDetails.user.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (reportDetails) => <span>{reportDetails.user.email}</span>,
    },
    {
      key: "phoneNo",
      label: "Phone No.",
      render: (reportDetails) => <span>{reportDetails.user.phoneNo}</span>,
    },
    {
      key: "reportType",
      label: "Report Type",
      render: (reportDetails) => <span>{reportDetails.reportType}</span>,
    },
    {
      key: "action",
      label: "Action",
      render: (reportDetails) => (
        <IconButtonWithTooltip
          onClick={() => viewProfile(reportDetails.user.phoneNo)}
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
          <h2 className="text-3xl">Report Users</h2>
          <DataTable<PropertyReportDetails>
            columns={columns}
            data={paginatedRows}
            getRowId={(reportDetails) => reportDetails.reportId.toString()}
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

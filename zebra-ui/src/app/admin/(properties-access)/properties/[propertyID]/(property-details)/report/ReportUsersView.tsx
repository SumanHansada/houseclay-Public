"use client";

import { Eye, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { LocalPaginatedTable } from "@/components/LocalPaginatedTable";
import { UserInfo } from "@/interfaces/User";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { Popover } from "@/utility-components";
import { buildUserColumns } from "@/utils/tableColumnBuilders";

interface SerializedReportRow extends UserInfo {
  _serial: number;
  reportId: number;
  reportType: string;
  comment: string;
}

export const ReportUsersView = ({ propertyID }: { propertyID: string }) => {
  const router = useRouter();

  const { data: currentProperty, isLoading } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });

  // parent layout already ensures data is present
  if (!currentProperty) return null;
  const { reportUsers = [] } = currentProperty;

  // Flatten the nested data so it works perfectly with the Column Builder
  const rows: SerializedReportRow[] = reportUsers.map((report, index) => ({
    ...report.user,
    _serial: index + 1,
    reportId: report.reportId,
    reportType: report.reportType,
    comment: report.comment,
  }));

  const viewProfile = (phoneNo: string) => {
    router.push(`/admin/users/${phoneNo}`);
  };

  // remove the default Action column
  const baseColumns = buildUserColumns().filter((col) => col.key !== "action");

  // Append our custom columns
  const columns = [
    ...baseColumns,
    {
      key: "reportType",
      label: "Report Type",
      accessor: "reportType" as keyof SerializedReportRow,
    },
    {
      key: "action",
      label: "Action",
      className: "w-24",
      render: (row: SerializedReportRow) => (
        <div className="flex items-center gap-1">
          <IconButtonWithTooltip
            onClick={() => viewProfile(row.phoneNo)}
            icon={Eye}
            tooltip="View Profile"
          />

          <Popover
            id={`report-popover-${row.reportId}`}
            trigger="click"
            align="end"
            offset={8}
            panelClassName="max-w-96 shadow-xl border border-gray-100 rounded-lg overflow-hidden"
            content={({ close }) => (
              <div className="bg-white">
                <div className="flex items-center justify-between gap-3 px-2 py-1 bg-gray-50 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Report Comment
                  </h4>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                    onClick={close}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-1">
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-5 break-words whitespace-pre-wrap">
                    {row.comment || "No comment provided."}
                  </p>
                </div>
              </div>
            )}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100"
              aria-label="property-card-actions"
            >
              <Info size={18} />
            </button>
          </Popover>
        </div>
      ),
    },
  ];

  return (
    <LocalPaginatedTable
      tableTitle="Report Details"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.reportId.toString()}
      noDataMessage="No reports found."
      isLoading={isLoading}
    />
  );
};

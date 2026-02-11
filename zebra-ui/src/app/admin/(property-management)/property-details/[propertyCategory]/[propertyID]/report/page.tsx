"use client";
import { Eye, Info, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { PropertyReportDetails } from "@/interfaces/api";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { Popover } from "@/utility-components";

const ROWS_PER_PAGE = 10;

export default function ReportUsersPage() {
  const router = useRouter();
  const { propertyID } = useParams() as { propertyID: string };

  const { data: currentProperty, isLoading } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });
  const rows = currentProperty?.reportUsers ?? [];

  const { currentPage, paginatedRows, totalPages, goToPage } =
    useLocalPagination(rows, ROWS_PER_PAGE);

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
      className: "w-24",
      render: (reportDetails) => (
        <div className="flex items-center gap-2">
          <IconButtonWithTooltip
            onClick={() => viewProfile(reportDetails.user.phoneNo)}
            Icon={Eye}
            tooltipActive={true}
            tooltip="View Profile"
          />

          <Popover
            id={`report-popover-${reportDetails.reportId}`}
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
                    {reportDetails.comment || "No comment provided."}
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
              <Info size={20} />
            </button>
          </Popover>
        </div>
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
              <h2 className="text-2xl font-medium text-gray-700">
                Report Details
              </h2>
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
                <DataTable<PropertyReportDetails>
                  columns={columns}
                  data={paginatedRows}
                  getRowId={(reportDetails) =>
                    reportDetails.reportId.toString()
                  }
                  noDataMessage="No reports found."
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

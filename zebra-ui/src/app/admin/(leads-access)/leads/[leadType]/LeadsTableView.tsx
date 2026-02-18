"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { RenderLeadStatus } from "@/components/status/RenderLeadStatus";
import { Lead, LEAD_TYPE_MAP, LeadType } from "@/interfaces/Lead";
import { useGetLeadsQuery } from "@/store/apiSlice";
import { safeUrlDecode } from "@/utils/core";

import { TableActionButtons } from "../components/TableActionButtons";

const ROWS_PER_PAGE = 12;

export const LeadsTableView = ({ leadType }: { leadType: LeadType }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const statusBarTitle =
    leadType === "property"
      ? "Property Listing Leads"
      : leadType === "support"
        ? "Search Support Leads"
        : "Upgrade Property Leads";

  const {
    data: paginatedLeadData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetLeadsQuery(
    {
      type: LEAD_TYPE_MAP[leadType],
      page: currentPage - 1,
      size: ROWS_PER_PAGE,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { content: allLeads = [], totalPages = 0 } = paginatedLeadData || {};

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const viewUserProfile = (phoneNo: string) => {
    router.push(`/admin/users/${phoneNo}`);
  };

  const viewLeadDetails = (id: number) => {
    router.push(`/admin/leads/${leadType}/${id}`);
  };

  const columns: Column<Lead>[] = [
    {
      key: "name",
      label: "Name",
      accessor: "name",
    },
    { key: "email", label: "Email", accessor: "email" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "status",
      label: "Status",
      render: (lead) => <RenderLeadStatus status={lead.status} />,
    },
    {
      key: "action",
      label: "Action",
      className: "w-80",
      render: (lead) => (
        <TableActionButtons
          leadId={lead.leadId}
          viewLeadDetails={() => viewLeadDetails(lead.leadId)}
          viewUserProfile={() => viewUserProfile(safeUrlDecode(lead.phoneNo))}
        />
      ),
    },
  ];

  // Initial Hard Loading State
  if (isLoading) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={false}
        loadingMessage={`Loading ${statusBarTitle}...`}
      />
    );
  }

  // Error State
  if (isError || !paginatedLeadData) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch Leads."
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky top status title bar */}
      <div className="h-16 sticky top-0 z-10 bg-white border border-b-gray-200 shadow-sm px-8 py-4 flex items-center">
        <h1 className="text-2xl font-medium">Lead Management</h1>
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
          {/* Table Header */}
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-medium">{statusBarTitle}</h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={allLeads}
              getRowId={(lead) => lead.leadId.toString()}
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

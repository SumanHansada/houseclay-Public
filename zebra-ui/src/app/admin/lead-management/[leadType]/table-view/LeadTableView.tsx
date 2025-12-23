"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LeadQueryParamEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { RenderLeadStatus } from "@/components/status/RenderLeadStatus";
import { Lead, LeadType } from "@/interfaces/Lead";
import { useGetLeadsQuery } from "@/store/apiSlice";

import { TableActionButtons } from "../../components/TableActionButtons";

const ROWS_PER_PAGE = 12;

export const LeadTableView = () => {
  const router = useRouter();
  const { leadType } = useParams() as { leadType: LeadType };
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
      type: LeadQueryParamEnum[leadType],
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
    router.push(`/admin/user-details/${phoneNo}`);
  };

  const viewLeadDetails = (id: number) => {
    router.push(`/admin/lead-management/${leadType}/${id}`);
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
          viewUserProfile={() => viewUserProfile(lead.phoneNo)}
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top status title bar */}
        <div className="sticky top-0 z-10 bg-white border border-b-gray-200 shadow-sm px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Lead Management
          </h1>
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-50 p-8 overflow-hidden">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl border border-gray-200 relative overflow-hidden">
            {/* Blocks interaction with table while fetching */}
            {isFetching && (
              <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="bg-white p-4 rounded-full shadow-lg border flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              </div>
            )}

            {/* Inner Header with Page Count */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                {statusBarTitle}
              </h2>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              <div
                className={
                  isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
                }
              >
                <DataTable
                  columns={columns}
                  data={allLeads}
                  getRowId={(lead) => lead.leadId.toString()}
                />
              </div>
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
    </div>
  );
};

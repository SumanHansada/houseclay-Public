"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { TitleAndSearchBar } from "@/components/TitleAndSearchBar";
import { Lead, LeadType } from "@/interfaces/Lead";
import { useGetLeadsQuery } from "@/store/apiSlice";

import { RenderLeadStatus } from "@/components/status/RenderLeadStatus";
import { TableActionButtons } from "../../components/TableActionButtons";
import AsyncFallback from "@/components/AsyncFallback";
import { LeadQueryParamEnum } from "@/common/enum";

export const LeadTableView = () => {
  const router = useRouter();
  const { leadType } = useParams() as { leadType: LeadType };
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const statusBarTitle =
    leadType === "property" ? "Property Listing Leads" : "Search Support Leads";

  const {
    data: paginatedLeadData,
    isLoading,
    isError,
    error,
  } = useGetLeadsQuery(
    {
      type: LeadQueryParamEnum[leadType],
      page: currentPage - 1,
      size: rowsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  if (isLoading || isError || !paginatedLeadData) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || !paginatedLeadData}
        error={error}
        loadingMessage={`Loading ${statusBarTitle}…`}
        errorMessage="Failed to fetch Leads."
      />
    );
  }

  const allLeads = paginatedLeadData.content;
  const totalPages = paginatedLeadData.totalPages;
  const isFirst = paginatedLeadData.first;
  const isLast = paginatedLeadData.last;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

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
          viewLeadDetails={() => viewLeadDetails(lead.leadId)}
          viewUserProfile={() => viewUserProfile(lead.phoneNo)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm">
          <TitleAndSearchBar
            searchValue={searchValue}
            onSearchChange={(v) => {
              setSearchValue(v);
            }}
            title={statusBarTitle}
          />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 px-16 py-6">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4">
            <DataTable
              columns={columns}
              data={allLeads}
              getRowId={(lead) => lead.leadId.toString()}
            />
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-b-gray-200 shadow-sm">
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
    </div>
  );
};

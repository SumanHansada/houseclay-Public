"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { TablePagination } from "@/components/TablePagination";
import { Lead, LeadQueryParamEnum, LeadType } from "@/interfaces/Lead";
import { useGetLeadsQuery } from "@/store/apiSlice";

import { RenderLeadStatus } from "../../components/RenderLeadStatus";
import { TableCellActions } from "../../components/TableCellActions";

interface LeadTableViewProps {
  leadType: LeadType;
}

export const LeadTableView = ({ leadType }: LeadTableViewProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useGetLeadsQuery({
    type: LeadQueryParamEnum[leadType],
    page: currentPage - 1,
    size: rowsPerPage,
  });

  const allLeads = useMemo<Lead[]>(() => {
    return data?.content ?? [];
  }, [data?.content]);

  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  const viewUserProfile = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };

  const viewLeadDetails = (id: number) => {
    router.push(`/admin/lead-management/${leadType}/lead/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading leads…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <span>Error loading leads.</span>
      </div>
    );
  }

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
      render: (lead) => (
        <TableCellActions
          viewLeadDetails={() => viewLeadDetails(lead.leadId)}
          viewUserProfile={() => viewUserProfile(lead.phoneNo)}
        />
      ),
    },
  ];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const statusBarTitle =
    leadType === "property" ? "Property Listing Leads" : "Search Support Leads";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm">
          <SearchFilterBar
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
          <TablePagination
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

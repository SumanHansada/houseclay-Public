"use client";

import { ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { LeadQueryParam, LeadStatus, LeadType, TLead } from "@/interfaces/Lead";
import { useGetLeadsQuery } from "@/store/apiSlice";

import { Pagination } from "../../user-management/components/Pagination";
import { SearchFilterBar } from "../../user-management/components/SearchFilterBar";
import { UserCard } from "./UserCard";

interface LeadTableViewProps {
  leadType: LeadType;
}

export const LeadTableView = ({ leadType }: LeadTableViewProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  const queryParam = LeadQueryParam[leadType];
  const { data, isLoading, isError } = useGetLeadsQuery({
    type: queryParam,
    page: currentPage - 1,
    size: rowsPerPage,
  });

  const allLeads = useMemo<TLead[]>(() => {
    return data?.content ?? [];
  }, [data?.content]);
  console.log(allLeads);

  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  const viewProfile = (phoneNo: string) => {
    router.push(`/admin/user-details/${phoneNo}`);
  };

  const viewLead = (id: number) => {
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

  const renderStatus = (status: LeadStatus): ReactNode => {
    switch (status) {
      case LeadStatus.NEW:
        return (
          <div className="px-[10px] py-[6px] bg-blue-400 border border-blue-900 text-blue-900 rounded-full w-fit">
            New Lead
          </div>
        );
      case LeadStatus.FOLLOW_UP:
        return (
          <div className="px-[10px] py-[6px] bg-red-400 border border-red-900 text-red-900 rounded-full w-fit">
            Follow Up
          </div>
        );
      case LeadStatus.RESOLVED:
        return (
          <div className="px-[10px] py-[6px] bg-green-400 border border-green-900 text-green-900 rounded-full w-fit">
            Resolved
          </div>
        );
      default:
        return null;
    }
  };

  const columns: Column<TLead>[] = [
    {
      key: "name",
      label: "Name",
      render: (lead) => (
        <UserCard
          avatar={lead.avatar}
          name={lead.name}
          email={lead.email}
          viewProfile={() => viewProfile(lead.phoneNo)}
        />
      ),
    },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "status",
      label: "Status",
      render: (lead) => renderStatus(lead.status as LeadStatus),
    },
    {
      key: "action",
      label: "Action",
      render: (lead) => (
        <button
          onClick={() => viewLead(lead.leadId)}
          className="ml-5 flex items-center"
        >
          <ChevronsRight />
          {/* <CircleArrowRight /> */}
        </button>
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
          />
        </div>

        {/* Table area */}
        <div className="flex items-center flex-1 overflow-y-auto px-8">
          <DataTable
            columns={columns}
            data={allLeads}
            getRowId={(lead) => lead.leadId.toString()}
          />
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-b-gray-200 shadow-sm">
          <Pagination
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

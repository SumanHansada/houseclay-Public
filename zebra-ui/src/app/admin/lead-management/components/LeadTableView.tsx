"use client";
import { ReactNode, useMemo, useState } from "react";
import { SearchFilterBar } from "../../user-management/components/SearchFilterBar";
import { Pagination } from "../../user-management/components/Pagination";
import { LeadStatus, LeadType, TLead } from "@/common/Types";
import { useRouter } from "next/navigation";
import { UserCard } from "./UserCard";
import { ChevronsRight, CircleArrowRight } from "lucide-react";
import { Column, DataTable } from "@/components/DataTable";

interface LeadTableViewProps {
  leads: TLead[];
  leadType: LeadType;
}

export const LeadTableView = ({ leads, leadType }: LeadTableViewProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const router = useRouter();

  const viewProfile = (id: string) => {
    router.push(`/admin/user-details/${id}`);
  };

  const viewLead = (id: string) => {
    router.push(`/admin/lead-management/${leadType}/lead/${id}`);
  };

  const renderStatus = (status: LeadStatus): ReactNode => {
    switch (status) {
      case "new":
        return (
          <div className="px-[10px] py-[6px] bg-blue-400 border border-blue-900 text-blue-900 rounded-full w-fit">
            New Lead
          </div>
        );
      case "follow":
        return (
          <div className="px-[10px] py-[6px] bg-red-400 border border-red-900 text-red-900 rounded-full w-fit">
            Follow Up
          </div>
        );
      case "resolved":
        return (
          <div className="px-[10px] py-[6px] bg-green-400 border border-green-900 text-green-900 rounded-full w-fit">
            Resolved
          </div>
        );
      default:
        return null;
    }
  };

  const filtered = useMemo(
    () =>
      leads.filter((user) => {
        const matchesSearch = user.phoneNo.includes(searchValue);
        return matchesSearch;
      }),
    [leads, searchValue],
  );

  const columns: Column<TLead>[] = [
    {
      key: "name",
      label: "Name",
      render: (lead) => (
        <UserCard
          avatar={lead.avatar}
          name={lead.name}
          email={lead.email}
          viewProfile={() => viewProfile(lead.id)}
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
          onClick={() => viewLead(lead.id)}
          className="ml-5 flex items-center"
        >
          <ChevronsRight />
          {/* <CircleArrowRight /> */}
        </button>
      ),
    },
  ];

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const isFirst = page === 1;
  const isLast = page === totalPages;

  const nextPage = () => !isLast && setPage((p) => p + 1);
  const prevPage = () => !isFirst && setPage((p) => p - 1);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm">
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={(v) => {
              setSearchValue(v);
              setPage(1);
            }}
          />
        </div>

        {/* Table area */}
        <div className="flex items-center flex-1 overflow-y-auto px-8">
          <DataTable
            columns={columns}
            data={paged}
            getRowId={(lead) => lead.id}
          />
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-b-gray-200 shadow-sm">
          <Pagination
            currentPage={page}
            isFirst={isFirst}
            isLast={isLast}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
};

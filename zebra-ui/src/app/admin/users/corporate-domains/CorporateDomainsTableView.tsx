"use client";

import { CheckCircle, ExternalLink, XCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

import SelectDropdown from "@/base-components/SelectDropdown";
import { CorporateDomainStatus } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { Column, DataTable } from "@/components/DataTable";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { Pagination } from "@/components/Pagination";
import { Pill } from "@/components/Pill";
import { ActionDialog } from "@/dialogs/action-dialog";
import { CorporateDomain } from "@/interfaces/api";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useApproveCorporateDomainMutation,
  useDenyCorporateDomainMutation,
  useGetCorporateDomainsQuery,
} from "@/store/apiSlice";
import { Popover } from "@/utility-components";

interface SerializedDomainRow extends CorporateDomain {
  _serial: number;
}

const ROWS_PER_PAGE = 12;

export const CorporateDomainsTableView = ({
  currentPage,
}: {
  currentPage: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { isDialogOpen, openDialog } = useDialog();

  const [approveDomain] = useApproveCorporateDomainMutation();
  const [denyDomain] = useDenyCorporateDomainMutation();

  const [selectedDomain, setSelectedDomain] =
    useState<SerializedDomainRow | null>(null);

  const statusParam = searchParams.get("status") || "all";

  // update URL
  const updateURL = useCallback(
    (page: number, newStatus?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());

      if (newStatus !== undefined) {
        if (newStatus === "all") params.delete("status");
        else params.set("status", newStatus);
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  // Get Domains
  const {
    data: paginatedDomainsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCorporateDomainsQuery(
    { status: statusParam, page: currentPage - 1, size: ROWS_PER_PAGE },
    { refetchOnMountOrArgChange: true },
  );

  const { content: domainsList = [], totalPages = 0 } =
    paginatedDomainsData || {};

  useEffect(() => {
    if (!isLoading && totalPages > 0 && currentPage > totalPages) {
      updateURL(1);
    }
  }, [totalPages, currentPage, isLoading, updateURL]);

  const rows: SerializedDomainRow[] = domainsList.map((domain, index) => ({
    ...domain,
    _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
  }));

  const domainsCount = paginatedDomainsData?.totalElements || 0;

  const handleVisit = (row: SerializedDomainRow) => {
    const url = row.domainName.startsWith("http")
      ? row.domainName
      : `https://${row.domainName}`;
    window.open(url, "_blank");
  };

  const handleApprove = (row: SerializedDomainRow) => {
    setSelectedDomain(row);
    openDialog("approveDomain");
  };

  const handleDeny = (row: SerializedDomainRow) => {
    setSelectedDomain(row);
    openDialog("denyDomain");
  };

  const columns: Column<SerializedDomainRow>[] = [
    { key: "serial", label: "#", accessor: "_serial", className: "w-16" },
    {
      key: "domainName",
      label: "Domain Name",
      accessor: "domainName",
    },
    {
      key: "websiteTitle",
      label: "Website Title",
      render: (d) => {
        const title = d.websiteTitle || "—";
        return (
          <Popover
            id={`popover-domain-title-${d.id}`}
            trigger="hover"
            content={
              <div className="p-3 max-w-xs md:max-w-sm text-sm text-gray-700 font-medium break-words">
                {title}
              </div>
            }
          >
            <div className="max-w-[150px] md:max-w-[200px] xl:max-w-[250px] truncate cursor-help">
              {title}
            </div>
          </Popover>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (d) => {
        let color: "green" | "red" | "yellow" = "yellow";
        if (d.status === CorporateDomainStatus.ALLOWED) color = "green";
        if (d.status === CorporateDomainStatus.DENIED) color = "red";
        return <Pill color={color}>{d.status}</Pill>;
      },
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      render: (d) => new Date(d.updatedAt).toLocaleString("en-IN"),
    },
    {
      key: "action",
      label: "Action",
      className: "w-24",
      render: (row) => {
        const isPending = row.status === CorporateDomainStatus.PENDING;
        return (
          <div className="flex items-center gap-2">
            <IconButtonWithTooltip
              icon={ExternalLink}
              tooltip="Visit Website"
              onClick={() => handleVisit(row)}
            />
            {isPending && (
              <>
                <IconButtonWithTooltip
                  icon={CheckCircle}
                  tooltip="Approve Domain"
                  onClick={() => handleApprove(row)}
                />
                <IconButtonWithTooltip
                  icon={XCircle}
                  tooltip="Deny Domain"
                  onClick={() => handleDeny(row)}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={false}
        loadingMessage="Loading corporate domains..."
      />
    );
  }

  if (isError || !paginatedDomainsData) {
    return (
      <AsyncFallback
        isLoading={false}
        isError={true}
        error={error}
        errorMessage="Failed to fetch corporate domains."
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Table area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-md rounded-xl relative overflow-hidden p-2 gap-2">
          {/* Table Header */}
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium">
                Corporate Domains - [{domainsCount}]
              </h1>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <SelectDropdown
                name="domain-status-filter"
                id="domain-status-filter"
                value={statusParam}
                onChange={(val) => updateURL(1, val as string)}
                options={[
                  { label: "All Domains", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Allowed", value: "allowed" },
                  { label: "Denied", value: "denied" },
                ]}
                variant="outline"
                containerClassName="w-56"
                buttonClassName="flex justify-between items-center w-full px-4 py-2 border rounded-xl text-left bg-white text-gray-700"
                dropdownClassName="absolute right-0 z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(domain) => domain.id.toString()}
              noDataMessage="No domains found."
              isLoading={isFetching || isPending}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom pagination */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-4 px-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={updateURL}
          isLoading={isFetching || isPending}
        />
      </div>

      {isDialogOpen("approveDomain") && selectedDomain && (
        <ActionDialog
          id="approveDomain"
          title="Approve Corporate Domain"
          prompt={`Are you sure you want to allow the domain: ${selectedDomain.domainName}?`}
          confirmLabel="Approve"
          colour="green"
          onConfirm={async () => {
            await approveDomain({ id: selectedDomain.id }).unwrap();
            toast.success("Domain approved successfully.");
          }}
        />
      )}

      {isDialogOpen("denyDomain") && selectedDomain && (
        <ActionDialog
          id="denyDomain"
          title="Deny Corporate Domain"
          prompt={`Are you sure you want to deny the domain: ${selectedDomain.domainName}?`}
          confirmLabel="Deny"
          colour="red"
          onConfirm={async () => {
            await denyDomain({ id: selectedDomain.id }).unwrap();
            toast.success("Domain denied successfully.");
          }}
        />
      )}
    </div>
  );
};

"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { TablePagination } from "@/components/TablePagination";
import { GetAllPropertiesResponse, PropertyInfo } from "@/interfaces/Property";

import { RenderPropertyStatus } from "../user-details/components/RenderPropertyStatus";
import { TableCellActions } from "../user-details/components/TableCellActions";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

interface ListPropertiesProps {
  propertyList: GetAllPropertiesResponse;
}

export const ListProperties = ({ propertyList }: ListPropertiesProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const rowsPerPage = 10;

  const allProperties = useMemo<PropertyInfo[]>(() => {
    return propertyList.content ?? [];
  }, [propertyList.content]);

  const totalPages = propertyList?.totalPages ?? 0;
  const isFirst = propertyList?.first ?? true;
  const isLast = propertyList?.last ?? true;

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  const rows: PropertyRow[] = allProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  //   const filteredUsers = useMemo(
  //     () =>
  //       allProperties.filter((user) =>
  //         user.phoneNo.includes(searchValue.toLowerCase()),
  //       ),
  //     [allProperties, searchValue],
  //   );

  //   if (isLoading) {
  //     return (
  //       <div className="flex justify-center items-center h-64">
  //         <span>Loading users…</span>
  //       </div>
  //     );
  //   }

  //   if (isError) {
  //     return (
  //       <div className="flex justify-center items-center h-64 text-red-500">
  //         <span>Error loading users.</span>
  //       </div>
  //     );
  //   }
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const columns: Column<PropertyRow>[] = [
    {
      key: "serial",
      label: "Sr. No.",
      accessor: "_serial",
      className: "w-20",
    },
    {
      key: "location",
      label: "Location",
      accessor: "location",
    },
    {
      key: "type",
      label: "Type",
      accessor: "type",
    },
    {
      key: "config",
      label: "Config",
      accessor: "config",
    },
    {
      key: "createdAt",
      label: "Last Modified",
      render: (p) =>
        p.lastModified
          ? new Date(p.lastModified).toLocaleString()
          : new Date(p.createdAt).toLocaleString(),
    },
    {
      key: "availableFrom",
      label: "Available From",
      render: (p) => new Date(p.availableFrom).toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (p) => <RenderPropertyStatus status={p.status} />,
    },
    {
      key: "action",
      label: "Action",
      render: (p) => (
        <TableCellActions
          viewDetails={() => viewPropertyDetails(p.propertyID)}
        />
      ),
    },
  ];

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
            title={"All Listed Properties"}
          />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-10 px-16">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-6">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(prop) => prop.propertyID}
            />
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
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

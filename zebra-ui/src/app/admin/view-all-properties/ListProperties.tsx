"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { TitleAndSearchBar } from "@/components/TitleAndSearchBar";
import { TablePagination } from "@/components/TablePagination";
import { GetAllPropertiesResponse, PropertyInfo } from "@/interfaces/Property";

import { RenderPropertyStatus } from "../user-details/components/RenderPropertyStatus";
import { TableCellActions } from "../user-details/components/TableCellActions";
import { dummyGetAllProperties } from "@/mock/getAllProperties";
import { createCommonColumns } from "../user-details/[userPhoneNo]/propertyColumns";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

export const ListProperties = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const rowsPerPage = 10;

  // const { data: paginatedPropertyData, isLoading, isError } = useGetAllProperties({
  //   page: currentPage - 1,
  //   size: rowsPerPage,
  // });
  const paginatedPropertyData: GetAllPropertiesResponse = dummyGetAllProperties;

  // if (isLoading || !data) {
  //   return (
  //     <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
  //       <span className="text-gray-500">Loading user details…</span>
  //     </div>
  //   );
  // }
  // if (isError) {
  //   return (
  //     <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
  //       <span className="text-red-500">Failed to fetch user details.</span>
  //     </div>
  //   );
  // }

  // const propertyList: PropertyInfo[] = data.content;
  const propertyList: PropertyInfo[] = paginatedPropertyData.content;

  const totalPages = paginatedPropertyData.totalPages;
  const isFirst = paginatedPropertyData.first;
  const isLast = paginatedPropertyData.last;

  const viewPropertyDetails = (type: string, propertyID: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}`);
  };

  const rows: PropertyRow[] = propertyList.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const columns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);

  // const columns: Column<PropertyRow>[] = [
  //   {
  //     key: "serial",
  //     label: "Sr. No.",
  //     accessor: "_serial",
  //     className: "w-20",
  //   },
  //   {
  //     key: "location",
  //     label: "Location",
  //     accessor: "location",
  //   },
  //   {
  //     key: "type",
  //     label: "Type",
  //     accessor: "type",
  //   },
  //   {
  //     key: "config",
  //     label: "Config",
  //     accessor: "config",
  //   },
  //   {
  //     key: "createdAt",
  //     label: "Last Modified",
  //     render: (p) =>
  //       p.lastModified
  //         ? new Date(p.lastModified).toLocaleString()
  //         : new Date(p.createdAt).toLocaleString(),
  //   },
  //   {
  //     key: "availableFrom",
  //     label: "Available From",
  //     render: (p) => new Date(p.availableFrom).toLocaleString(),
  //   },
  //   {
  //     key: "status",
  //     label: "Status",
  //     render: (p) => <RenderPropertyStatus status={p.status} />,
  //   },
  //   {
  //     key: "action",
  //     label: "Action",
  //     render: (p) => (
  //       <TableCellActions
  //         viewDetails={() => viewPropertyDetails(p.propertyID, p.type)}
  //       />
  //     ),
  //   },
  // ];

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
            title={"Filter Bar"}
          />
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-6 px-16">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4 gap-4">
            <h1 className="text-2xl font-medium">All Listed Properties</h1>
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

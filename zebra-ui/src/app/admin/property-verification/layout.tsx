"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

// import { TitleAndSearchBar } from "@/components/TitleAndSearchBar";
import { TablePagination } from "@/components/TablePagination";
import { PropertyInfo } from "@/interfaces/Property";
import { dummyGetPropertiesToBeVerified } from "@/mock/getAllProperties";
import { VerifyPropertyStatusEnum } from "@/common/enums";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

const PropertyVerificationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { status } = useParams() as { status: VerifyPropertyStatusEnum };
  // const rowsPerPage = 10;

  //   const { data, isLoading, isError } = useGetPropertiesQuery({
  //     page: currentPage - 1,
  //     size: rowsPerPage,
  //   });
  const data = dummyGetPropertiesToBeVerified;

  const allProperties = useMemo<PropertyInfo[]>(() => {
    return data?.content ?? [];
  }, [data?.content]);

  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  const rows: PropertyRow[] = allProperties.map((propertyInfo, index) => ({
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky top filter bar */}
        <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm">
          <div className="flex px-16 justify-between py-4">
            <div className="flex gap-3 items-center">
              <h1 className="text-2xl font-medium">Status:</h1>
              <button
                className={`py-2 px-3 rounded-xl border border-red-500 ${status === VerifyPropertyStatusEnum.VERIFY ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
                onClick={() =>
                  router.push(
                    `/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`,
                  )
                }
              >
                Verify Properties
              </button>
              <button
                className={`py-2 px-3 rounded-xl border border-red-500 ${status === VerifyPropertyStatusEnum.REVERIFY ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
                onClick={() =>
                  router.push(
                    `/admin/property-verification/${VerifyPropertyStatusEnum.REVERIFY}`,
                  )
                }
              >
                Re-verify Properties
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by phone..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-1/4 p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:border-red-500 focus:ring-0"
            />
          </div>
        </div>

        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-6 px-16">{children}</div>

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

export default PropertyVerificationLayout;

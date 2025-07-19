"use client";

import { ClipboardCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { VerifyPropertyStatusEnum } from "@/common/enums";
import AsyncFallback from "@/components/AsyncFallback";
import { DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useStatusBasedPropertyFetch } from "@/hooks/useStatusBasedPropertyFetch";
import { PropertyInfo } from "@/interfaces/Property";
import { buildPropertyColumns } from "@/utils/table/buildPropertyColumns";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const ROWS_PER_PAGE = 10;

const PropertyVerificationTablePage: React.FC = () => {
  const router = useRouter();
  const { status } = useParams() as { status: VerifyPropertyStatusEnum };
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedPropertyData,
    isLoading,
    isError,
    error,
  } = useStatusBasedPropertyFetch({
    status,
    page: currentPage - 1,
    size: ROWS_PER_PAGE,
  });

  if (isLoading || isError || !paginatedPropertyData) {
    return (
      <AsyncFallback
        isLoading={isLoading}
        isError={isError || !paginatedPropertyData}
        error={error}
        loadingMessage="Loading all properties…"
        errorMessage="Failed to fetch Properties."
      />
    );
  }

  const {
    content: allProperties,
    totalPages,
    first: isFirst,
    last: isLast,
  } = paginatedPropertyData;

  const rows: SerializedPropertyRow[] = allProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: (currentPage - 1) * ROWS_PER_PAGE + index + 1,
    }),
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);
  const viewPropertyDetails = (
    propertyCategory: string,
    propertyID: string,
  ) => {
    const verifyPath = `/admin/property-details/${propertyCategory.toLowerCase()}/verify/${propertyID}`;
    const reverifyPath = `/admin/property-details/${propertyCategory.toLowerCase()}/reverify/${propertyID}`;
    const currentPath =
      status === VerifyPropertyStatusEnum.VERIFY ? verifyPath : reverifyPath;
    router.push(currentPath);
  };

  const columns = buildPropertyColumns({
    verify: {
      icon: ClipboardCheck,
      tooltip: "Verify Listing",
      onClick: (row) =>
        viewPropertyDetails(row.propertyCategory, row.propertyID),
      classNameIcon: "size-5 text-primary",
    },
  });

  const handleStatusChange = (newStatus: VerifyPropertyStatusEnum) => {
    setCurrentPage(1);
    router.push(`/admin/property-verification/${newStatus}`);
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-sm rounded-xl">
      {/* Top section with Title and Status buttons */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">
            {status === VerifyPropertyStatusEnum.VERIFY
              ? "Properties to be Verified"
              : "Properties to be Re-verified"}
          </h1>
          <div className="flex gap-3 items-center">
            <h1 className="text-2xl font-medium">Status:</h1>
            <button
              className={`py-2 px-3 rounded-xl border border-red-500 ${
                status === VerifyPropertyStatusEnum.VERIFY
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500"
              }`}
              onClick={() =>
                handleStatusChange(VerifyPropertyStatusEnum.VERIFY)
              }
            >
              Pending
            </button>
            <button
              className={`py-2 px-3 rounded-xl border border-red-500 ${
                status === VerifyPropertyStatusEnum.REVERIFY
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500"
              }`}
              onClick={() =>
                handleStatusChange(VerifyPropertyStatusEnum.REVERIFY)
              }
            >
              Reported
            </button>
          </div>
        </div>
      </div>

      {/* overflow-y-auto ensures only the table scrolls if content is too long */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(prop) => prop.propertyID}
          noDataMessage="No properties found for this status."
        />
      </div>

      {/* Bottom section with Pagination */}
      <div className="border-t border-gray-200">
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          isFirst={isFirst}
          isLast={isLast}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          footerPadding="px-4 py-2"
        />
      </div>
    </div>
  );
};

export default PropertyVerificationTablePage;

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useMemo } from "react";

// import { VerifyPropertyStatusEnum } from "@/common/enums";
// import { Column, DataTable } from "@/components/DataTable";
// import { PropertyInfo } from "@/interfaces/Property";
// import {
//   dummyGetPropertiesToBeReVerified,
//   dummyGetPropertiesToBeVerified,
// } from "@/mock/propertyDetailsDummy";

// import { buildPropertyColumns } from "@/utils/commonPropertyColumns";

// interface PropertyRow extends PropertyInfo {
//   _serial: number;
// }

// const PropertyVerificationTable: React.FC = () => {
//   const router = useRouter();
//   const { status } = useParams() as { status: VerifyPropertyStatusEnum };
//   const data =
//     status === "pending"
//       ? dummyGetPropertiesToBeVerified
//       : dummyGetPropertiesToBeReVerified;

//   const allProperties = useMemo<PropertyInfo[]>(() => {
//     return data?.content ?? [];
//   }, [data?.content]);

//   const viewPropertyDetails = (type: string, propertyID: string) => {
//     router.push(`/admin/property-details/${type}/${propertyID}`);
//   };

//   const rows: PropertyRow[] = allProperties.map((propertyInfo, index) => ({
//     ...propertyInfo,
//     _serial: index + 1,
//   }));

//   const columns: Column<PropertyRow>[] =
//     buildPropertyColumns(viewPropertyDetails);

//   return (
//     <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4 gap-4">
//       <div className="flex justify-between">
//         <h1 className="text-3xl">
//           {status === VerifyPropertyStatusEnum.VERIFY
//             ? "Properties to be Verified"
//             : "Properties to be Re-verified"}
//         </h1>
//         <div className="flex gap-3 items-center">
//           <h1 className="text-2xl font-medium">Status:</h1>
//           <button
//             className={`py-2 px-3 rounded-xl border border-red-500 ${status === VerifyPropertyStatusEnum.VERIFY ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
//             onClick={() =>
//               router.push(
//                 `/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`,
//               )
//             }
//           >
//             Pending
//           </button>
//           <button
//             className={`py-2 px-3 rounded-xl border border-red-500 ${status === VerifyPropertyStatusEnum.REVERIFY ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
//             onClick={() =>
//               router.push(
//                 `/admin/property-verification/${VerifyPropertyStatusEnum.REVERIFY}`,
//               )
//             }
//           >
//             Reported
//           </button>
//         </div>
//       </div>

//       <DataTable
//         columns={columns}
//         data={rows}
//         getRowId={(prop) => prop.propertyID}
//       />
//     </div>
//   );
// };

// export default PropertyVerificationTable;

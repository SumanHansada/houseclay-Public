"use client";

import React from "react";

import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";

const PropertyVerificationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Sticky top filter bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm px-16 py-2">
        <SearchAndFilterBar />
      </div>

      <main className="flex-1 bg-gray-100 px-16 py-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default PropertyVerificationLayout;

// "use client";

// import React, { useState } from "react";

// import { SearchAndFilterBar } from "@/components/SearchAndFilterBar";
// import { PaginationFooter } from "@/components/PaginationFooter";
// import { dummyGetPropertiesToBeVerified } from "@/mock/propertyDetailsDummy";

// const PropertyVerificationLayout = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   // const rowsPerPage = 10;

//   //   const { data, isLoading, isError } = useGetPropertiesQuery({
//   //     page: currentPage - 1,
//   //     size: rowsPerPage,
//   //   });
//   const data = dummyGetPropertiesToBeVerified;

//   const totalPages = data?.totalPages ?? 0;
//   const isFirst = data?.first ?? true;
//   const isLast = data?.last ?? true;

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };
//   const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
//   const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)]">
//       <div className="flex flex-col flex-1 h-full">
//         {/* Sticky top filter bar */}
//         <div className="sticky top-0 z-10 border border-b-gray-200 shadow-sm px-16 py-2">
//           <SearchAndFilterBar />
//         </div>

//         {/* Table area */}
//         <div className="flex flex-1 bg-gray-100 py-6 px-16">{children}</div>

//         {/* Sticky bottom pagination */}
//         <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
//           <PaginationFooter
//             currentPage={currentPage}
//             totalPages={totalPages}
//             isFirst={isFirst}
//             isLast={isLast}
//             goToPage={goToPage}
//             nextPage={nextPage}
//             prevPage={prevPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyVerificationLayout;

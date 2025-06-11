"use client";
import React, { useMemo, useState } from "react";
import { Column, DataTable } from "@/components/DataTable";
import { TablePagination } from "@/components/TablePagination";

interface PropertiesTableViewProps<
  RowType extends { propertyID: string; _serial: number },
> {
  tableTitle: string;
  columns: Column<RowType>[];
  rows: RowType[];
  rowsPerPage?: number;
}

export function PropertiesTableView<
  RowType extends { propertyID: string; _serial: number },
>(props: PropertiesTableViewProps<RowType>) {
  const { tableTitle, columns, rows, rowsPerPage = 10 } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-100 flex-1 py-6 px-16">
          <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-5 h-full">
            <h2 className="text-3xl">{tableTitle}</h2>
            <DataTable<RowType>
              columns={columns}
              data={paginatedRows}
              getRowId={(row) => row.propertyID}
            />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
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
}

// "use client";
// import { UserPropertyInfo } from "@/interfaces/User";
// import { useMemo, useState } from "react";
// import { Column, DataTable } from "@/components/DataTable";
// import { TablePagination } from "@/components/TablePagination";

// interface PropertiesTableViewProps {
//   tableTitle: string;
//   columns: Column<UserPropertyInfo & { _serial: number }>[];
//   listOfProperties: UserPropertyInfo[];
//   rowsPerPage?: number;
// }

// export const PropertiesTableView: React.FC<PropertiesTableViewProps> = ({
//   tableTitle,
//   columns,
//   rowsPerPage = 10,
//   listOfProperties,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const allProperties = useMemo<UserPropertyInfo[]>(() => {
//     return listOfProperties ?? [];
//   }, [listOfProperties]);

//   const totalProperties = listOfProperties.length;
//   // console.log("properties: " + totalProperties);

//   const totalPages = Math.ceil(totalProperties / rowsPerPage);
//   // console.log("pages: " + totalPages);
//   const isFirst = currentPage === 1;
//   const isLast = currentPage === totalPages;

//   const paginatedProperties = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return allProperties.slice(start, start + rowsPerPage);
//   }, [allProperties, currentPage]);

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };
//   const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
//   const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

//   const dataWithSerial = useMemo(() => {
//     return paginatedProperties.map((prop, idx) => ({
//       ...prop,
//       _serial: (currentPage - 1) * rowsPerPage + idx + 1,
//     }));
//   }, [paginatedProperties, currentPage]);

//   return (
//     <div className="flex flex-col h-[calc(100vh-7rem)]">
//       <div className="flex flex-col flex-1 h-full">
//         {/* Table area */}
//         <div className="flex flex-1 bg-gray-100 py-6 px-16">
//           <div className="flex flex-col flex-1 bg-white shadow-sm rounded-lg p-4 gap-5">
//             <div className="text-3xl">{tableTitle}</div>
//             <DataTable
//               columns={columns}
//               data={dataWithSerial}
//               getRowId={(property) => property.propertyID}
//             />
//           </div>
//         </div>

//         {/* Sticky bottom pagination */}
//         <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
//           <TablePagination
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

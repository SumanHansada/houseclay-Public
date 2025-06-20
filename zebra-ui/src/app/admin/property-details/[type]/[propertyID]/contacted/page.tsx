// page.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { RenderUserStatus } from "@/app/admin/user-management/components/RenderUserStatus";
import { TableCellActions } from "@/app/admin/user-management/components/TableCellActions";
import { Column, DataTable } from "@/components/DataTable";
import { TablePagination } from "@/components/TablePagination";
import { User } from "@/interfaces/User";
import { dummyUserDataList } from "@/mock/userDetailsDummy";

export default function ContactedUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const contactedUsers: User[] = dummyUserDataList;

  const totalRows = contactedUsers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return contactedUsers.slice(start, start + rowsPerPage);
  }, [contactedUsers, currentPage]);

  const goToPage = (p: number) =>
    p >= 1 && p <= totalPages && setCurrentPage(p);
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const router = useRouter();
  const viewProfile = (phoneNo: string) =>
    router.push(`/admin/user-details/${phoneNo}`);

  const columns: Column<User>[] = [
    { key: "name", label: "Name", accessor: "name" },
    { key: "email", label: "Email", accessor: "email" },
    { key: "phoneNo", label: "Phone No.", accessor: "phoneNo" },
    {
      key: "blacklisted",
      label: "Status",
      render: (u) => <RenderUserStatus isBlacklisted={u.blacklisted} />,
    },
    {
      key: "action",
      label: "Action",
      render: (u) => (
        <TableCellActions viewProfile={() => viewProfile(u.phoneNo)} />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col bg-gray-100 py-8 px-16">
        <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4 h-full">
          <h2 className="text-3xl">User Contacted</h2>
          <DataTable<User>
            columns={columns}
            data={paginatedRows}
            getRowId={(u) => u.phoneNo}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 border-t bg-white">
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
  );
}

// "use client";
// import { useParams, useRouter } from "next/navigation";

// import { Column, DataTable } from "@/components/DataTable";
// import { PropertyInfo } from "@/interfaces/Property";
// import { dummyProperties, dummyUserDataList } from "@/mock/userDetailsDummy";
// import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

// // import { PropertiesTableView } from "../../components/PropertiesTableView";
// // import { createCommonColumns } from "../propertyColumns";
// import { User } from "@/interfaces/User";
// import { RenderUserStatus } from "@/app/admin/user-management/components/RenderUserStatus";
// import { TableCellActions } from "@/app/admin/user-management/components/TableCellActions";
// import { TablePagination } from "@/components/TablePagination";
// import { useMemo, useState } from "react";

// // interface PropertyRow extends PropertyInfo {
// //   _serial: number;
// // }

// const ContactedUsersPage: React.FC = () => {
//   //  const { tableTitle, columns, rows, rowsPerPage = 10 } = props;
//   const [currentPage, setCurrentPage] = useState(1);

//   const rowsPerPage = 10;
//   const contactedUsers: User[] = dummyUserDataList;
//   const rows = contactedUsers;
//   const tableTitle = "User Contacted";
//   const totalRows = rows.length;
//   const totalPages = Math.ceil(totalRows / rowsPerPage);
//   const isFirst = currentPage === 1;
//   const isLast = currentPage === totalPages;

//   const paginatedRows = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return rows.slice(start, start + rowsPerPage);
//   }, [rows, currentPage, rowsPerPage]);

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };
//   const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
//   const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);
//   const { userPhoneNo } = useParams() as { userPhoneNo: string };
//   const router = useRouter();

//   const viewProfile = (phoneNo: string) => {
//     router.push(`/admin/user-details/${phoneNo}`);
//   };

//   const columns: Column<User>[] = [
//     {
//       key: "name",
//       label: "Name",
//       accessor: "name",
//     },
//     {
//       key: "email",
//       label: "Email",
//       accessor: "email",
//     },
//     {
//       key: "phoneNo",
//       label: "Phone No.",
//       accessor: "phoneNo",
//     },
//     {
//       key: "blacklisted",
//       label: "Status",
//       render: (user) => <RenderUserStatus isBlacklisted={user.blacklisted} />,
//     },
//     {
//       key: "action",
//       label: "Action",
//       render: (user) => (
//         <TableCellActions viewProfile={() => viewProfile(user.phoneNo)} />
//       ),
//     },
//   ];

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 flex flex-col">
//         <div className="bg-gray-100 flex-1 py-8 px-16">
//           <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4 h-full">
//             <h2 className="text-3xl">{tableTitle}</h2>
//             <DataTable<User>
//               columns={columns}
//               data={paginatedRows}
//               getRowId={(user) => user.phoneNo}
//             />
//           </div>
//         </div>
//         <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
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

// export default ContactedUsersPage;

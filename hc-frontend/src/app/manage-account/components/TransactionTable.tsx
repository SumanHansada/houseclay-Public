"use client";

import { Download } from "lucide-react";
import DataTableWebsite, { DataTableColumn } from "./DataTableWebsite";
import type { UserExternalPayment } from "@/interfaces/User";
import { SvgIcon } from "@/utility-components";
import { TransactionStatus } from "./TransactionStatus";

export function TransactionTable({
  transactions,
  onDownload,
}: {
  transactions: UserExternalPayment[];
  onDownload: (paymentId: string) => void;
}) {
  const cols: DataTableColumn<UserExternalPayment>[] = [
    { key: "paymentType", header: "Type" },
    {
      key: "createdAt",
      header: "Date & Time",
      cell: (t) => new Date(t.createdAt).toLocaleString("en-IN"),
    },
    {
      key: "connects",
      header: "Connects",
      cell: (t) =>
        t.connects ? (
          <span className="inline-flex items-center gap-2">
            <SvgIcon iconSize="medium" name="coin" size={18} />
            <span className="text-base font-medium">{t.connects}</span>
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (t) => <span className="font-medium">₹{t.amount}/-</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (t) => TransactionStatus(t.status),
    },
    {
      key: "invoice",
      header: "Invoice",
      align: "center",
      cell: (t) =>
        t.invoice ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(t.paymentId);
            }}
            className="rounded-md p-1 hover:bg-gray-200"
            aria-label="Download invoice"
          >
            <Download size={20} className="text-red-500" />
          </button>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <DataTableWebsite<UserExternalPayment>
      rows={transactions}
      columns={cols}
      getRowId={(r) => r.paymentId}
      ariaLabel="Transactions"
      className="overflow-x-auto"
      dense
    />
  );
}

// import { Download } from "lucide-react";

// import { Column, WebsiteDataTable } from "@/components/DataTable";
// import { UserExternalPayment } from "@/interfaces/User";
// import { SvgIcon } from "@/utility-components";

// import { TransactionStatus } from "./TransactionStatus";

// export const TransactionTable = ({
//   transactions,
//   onDownload,
// }: {
//   transactions: UserExternalPayment[];
//   onDownload: (transactionId: string) => void;
// }) => {
//   const handleDownload = (transactionId: string) => {
//     console.log("Download Invoice: ", transactionId);
//     onDownload(transactionId);
//   };
//   const columns: Column<UserExternalPayment>[] = [
//     {
//       key: "type",
//       label: "Type",
//       cellClassName: "font-medium text-gray-800",
//       accessor: "paymentType",
//     },
//     {
//       key: "dateTime",
//       label: "Date & Time",
//       render: (payInfo) => new Date(payInfo.createdAt).toLocaleString("en-IN"),
//     },
//     {
//       key: "connects",
//       label: "Connects",
//       render: (payInfo) =>
//         payInfo.connects ? (
//           <span className="flex items-center">
//             <SvgIcon iconSize="medium" name="coin" size={20} />
//             <span className="text-xl font-medium text-gray-700">
//               {payInfo.connects}
//             </span>
//           </span>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       key: "amount",
//       label: "Amount",
//       cellClassName: "font-medium text-gray-800",
//       render: (payInfo) => <span>&#8377;{payInfo.amount}/-</span>,
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (payInfo) => {
//         return TransactionStatus(payInfo.status);
//       },
//     },
//     {
//       key: "invoice",
//       label: "Invoice",
//       render: (payInfo) =>
//         payInfo.invoice ? (
//           <button
//             className=""
//             onClick={() => handleDownload(payInfo.paymentId)}
//           >
//             <Download size={25} className="text-red-500" />
//           </button>
//         ) : (
//           "-"
//         ),
//     },
//   ];

//   return (
//     <div className="bg-white overflow-hidden">
//       <WebsiteDataTable
//         columns={columns}
//         data={transactions}
//         getRowId={(item) => item.paymentId}
//         noDataMessage="No transactions found"
//       />
//     </div>
//   );
// };

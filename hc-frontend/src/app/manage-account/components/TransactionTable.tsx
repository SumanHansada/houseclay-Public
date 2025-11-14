"use client";

import { ConnectBundleTitle } from "@/common/enums";
import { type Column, DataTable } from "@/components/DataTable";
import type { UserExternalPayment } from "@/interfaces/User";
import { SvgIcon } from "@/utility-components";

import { getStatusConfig } from "./statusConfig";

export function TransactionTable({
  transactions,
  // onDownload,
}: {
  transactions: UserExternalPayment[];
  // onDownload: (paymentId: string) => void;
}) {
  const columns: Column<UserExternalPayment>[] = [
    {
      key: "bundle",
      label: "Bundle Type",
      render: (transaction) => {
        const bundleKey = transaction.bundle as keyof typeof ConnectBundleTitle;
        return ConnectBundleTitle[bundleKey] ?? "Unknown Bundle";
      },
    },
    {
      key: "dateTime",
      label: "Date & Time",
      render: (transaction) =>
        new Date(transaction.createdAt).toLocaleString("en-IN"),
    },
    {
      key: "connects",
      label: "Connects",
      render: (transaction) =>
        transaction.connectQty ? (
          <span className="inline-flex items-center gap-1">
            <SvgIcon iconSize="medium" name="coin" size={18} />
            <span className="text-base font-medium">
              {transaction.connectQty}
            </span>
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (transaction) => (
        <span className="font-medium">&#8377;{transaction.amount}/-</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (transaction) => {
        const statusInfo = getStatusConfig(transaction.status);
        const StatusIcon = statusInfo.icon;

        return (
          <div
            className={`inline-flex items-center gap-2 ${statusInfo.textClassName}`}
          >
            <StatusIcon
              size={statusInfo.iconSize}
              className={statusInfo.iconClassName}
            />
            <span>{statusInfo.label}</span>
          </div>
        );
      },
    },
    // {
    //   key: "invoice",
    //   label: "Invoice",
    //   render: (transaction) =>
    //     transaction.invoice ? (
    //       <button
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           onDownload(transaction.paymentId);
    //         }}
    //         className="rounded-md p-1 hover:bg-gray-200"
    //         aria-label="Download invoice"
    //       >
    //         <Download size={20} className="text-red-500" />
    //       </button>
    //     ) : (
    //       "-"
    //     ),
    // },
  ];

  return (
    <div className="bg-white overflow-x-auto">
      <DataTable<UserExternalPayment>
        columns={columns}
        data={transactions}
        getRowId={(row) => row.paymentId}
        noDataMessage="No transactions found"
      />
    </div>
  );
}

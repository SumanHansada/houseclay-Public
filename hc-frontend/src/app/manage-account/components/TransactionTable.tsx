"use client";

import { Download } from "lucide-react";

import { type Column, DataTable } from "@/components/DataTable";
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
  const columns: Column<UserExternalPayment>[] = [
    {
      key: "type",
      label: "Type",
      accessor: "paymentType",
      // you can add className here if you want header-specific styling
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
        transaction.connects ? (
          <span className="inline-flex items-center gap-2">
            <SvgIcon iconSize="medium" name="coin" size={18} />
            <span className="text-base font-medium">
              {transaction.connects}
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
        <span className="font-medium">₹{transaction.amount}/-</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (transaction) => TransactionStatus(transaction.status),
    },
    {
      key: "invoice",
      label: "Invoice",
      render: (transaction) =>
        transaction.invoice ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(transaction.paymentId);
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

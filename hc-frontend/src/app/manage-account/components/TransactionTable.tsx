import { Download } from "lucide-react";

import { Column, WebsiteDataTable } from "@/components/DataTable";
import { SvgIcon } from "@/utility-components";
import { UserExternalPayment } from "@/interfaces/User";
import { TransactionStatus } from "./TransactionStatus";

export const TransactionTable = ({
  transactions,
  onDownload,
}: {
  transactions: UserExternalPayment[];
  onDownload: (transactionId: string) => void;
}) => {
  const handleDownload = (transactionId: string) => {
    console.log("Download Invoice: ", transactionId);
    onDownload(transactionId);
  };
  const columns: Column<UserExternalPayment>[] = [
    {
      key: "type",
      label: "Type",
      cellClassName: "font-medium text-gray-800",
      accessor: "paymentType",
    },
    {
      key: "dateTime",
      label: "Date & Time",
      render: (payInfo) => new Date(payInfo.createdAt).toLocaleString("en-IN"),
    },
    {
      key: "connects",
      label: "Connects",
      render: (payInfo) =>
        payInfo.connects ? (
          <span className="flex items-center">
            <SvgIcon iconSize="medium" name="coin" size={20} />
            <span className="text-xl font-medium text-gray-700">
              {payInfo.connects}
            </span>
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "amount",
      label: "Amount",
      cellClassName: "font-medium text-gray-800",
      render: (payInfo) => <span>&#8377;{payInfo.amount}/-</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (payInfo) => {
        return TransactionStatus(payInfo.status);
      },
    },
    {
      key: "invoice",
      label: "Invoice",
      render: (payInfo) =>
        payInfo.invoice ? (
          <button
            className=""
            onClick={() => handleDownload(payInfo.paymentId)}
          >
            <Download size={25} className="text-red-500" />
          </button>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <WebsiteDataTable
        columns={columns}
        data={transactions}
        getRowId={(item) => item.paymentId}
        noDataMessage="No transactions found"
      />
    </div>
  );
};

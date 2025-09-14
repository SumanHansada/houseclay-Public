import { CircleCheck, CircleX, Download } from "lucide-react";

import { PaymentFilterStatus } from "@/common/enums";
import { Column, WebsiteDataTable } from "@/components/DataTable";
import { MyTransaction } from "@/interfaces/ManageAccount";
import { SvgIcon } from "@/utility-components";

export const TransactionTable = ({
  transactions,
  onDownload,
}: {
  transactions: MyTransaction[];
  onDownload: (transactionId: string) => void;
}) => {
  const handleDownload = (transactionId: string) => {
    console.log("Download Invoice: ", transactionId);
    onDownload(transactionId);
  };
  const columns: Column<MyTransaction>[] = [
    {
      key: "type",
      label: "Type",
      cellClassName: "font-medium text-gray-800",
      accessor: "type",
    },
    {
      key: "dateTime",
      label: "Date & Time",
      render: (p) => new Date(p.dateTime).toLocaleString("en-IN"),
    },
    {
      key: "connects",
      label: "Connects",
      render: (item) =>
        item.connects ? (
          <span className="flex items-center">
            <SvgIcon iconSize="medium" name="coin" size={20} />
            <span className="text-xl font-medium text-gray-700">
              {item.connects}
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
      render: (item) => <span>&#8377;{item.amount}/-</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) =>
        item.status === PaymentFilterStatus.COMPLETED ? (
          <div className="flex gap-1 items-center">
            <CircleCheck size={25} className="text-white fill-lime-500" />
            <span>Completed</span>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <CircleX size={25} className="text-white fill-red-500" />
            <span>Cancelled</span>
          </div>
        ),
    },
    {
      key: "invoice",
      label: "Invoice",
      render: (item) =>
        item.invoice ? (
          <button className="" onClick={() => handleDownload(item.id)}>
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
        getRowId={(item) => item.id}
        noDataMessage="No transactions found"
      />
    </div>
  );
};

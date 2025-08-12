import { PaymentFilterStatus } from "@/common/enums";
import { Column, WebsiteDataTable } from "@/components/DataTable";

import CoinIconSvg from "public/icons/coin.svg";
import CircleCheckIconSvg from "public/icons/circle-check.svg";
import CircleCrossIconSvg from "public/icons/circle-cross.svg";
import DownloadIconSvg from "public/icons/download.svg";

const CircleCheckIcon = CircleCheckIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CircleCrossIcon = CircleCrossIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CoinIcon = CoinIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const DownloadIcon = DownloadIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface Transaction {
  id: string;
  type: string;
  dateTime: string;
  connects: number | null;
  amount: string;
  status: PaymentFilterStatus;
  invoice: boolean;
}

export const TransactionTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const columns: Column<Transaction>[] = [
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
            <CoinIcon width={20} height={20} />
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
            <CircleCheckIcon width={20} height={20} className="text-lime-500" />
            <span>Completed</span>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <CircleCrossIcon width={20} height={20} className="text-red-500" />
            <span>Cancelled</span>
          </div>
        ),
    },
    {
      key: "invoice",
      label: "Invoice",
      render: (item) =>
        item.invoice ? (
          <button className="">
            <DownloadIcon width={20} height={20} className="text-red-500" />
          </button>
        ) : null,
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

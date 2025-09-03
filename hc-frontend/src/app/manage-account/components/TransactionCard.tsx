import CircleCheckIconSvg from "public/icons/circle-check.svg";
import CircleCrossIconSvg from "public/icons/circle-cross.svg";
import CoinIconSvg from "public/icons/coin.svg";
import DownloadIconSvg from "public/icons/download.svg";

import { PaymentFilterStatus } from "@/common/enums";
import { MyTransaction } from "@/interfaces/ManageAccount";

const CircleCheckIcon = CircleCheckIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CircleCrossIcon = CircleCrossIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const DownloadIcon = DownloadIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CoinIcon = CoinIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

interface TransactionCardProps extends MyTransaction {
  onDownload: (transactionId: string) => void;
}

export function TransactionCard({
  id,
  type,
  status,
  invoice,
  connects,
  amount,
  onDownload,
}: TransactionCardProps) {
  const handleDownload = () => {
    onDownload(id);
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="border-b-2 pb-2 flex flex-col">
        <div className="w-full flex items-center justify-between mb-2">
          <h1 className="text-lg">{type}</h1>
          <span className="text-lg font-medium">&#8377;{amount}/-</span>
        </div>
        {connects ? (
          <div className="flex items-center">
            <CoinIcon width={20} height={20} />
            <span className="text-xl font-medium text-gray-700">
              {connects}
            </span>
          </div>
        ) : null}
      </div>
      <div className="w-full flex justify-between items-center mt-4">
        {status === PaymentFilterStatus.COMPLETED ? (
          <div className="flex gap-1 items-center">
            <CircleCheckIcon width={20} height={20} className="text-lime-500" />
            <span>Completed</span>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <CircleCrossIcon width={20} height={20} className="text-red-500" />
            <span>Cancelled</span>
          </div>
        )}

        {invoice ? (
          <button className="flex gap-2 items-center" onClick={handleDownload}>
            <span className="text-red-500">Download Invoice</span>
            <DownloadIcon width={18} height={18} className="text-red-500" />
          </button>
        ) : (
          <span className="text-red-500">Transaction Failed!</span>
        )}
      </div>
    </div>
  );
}

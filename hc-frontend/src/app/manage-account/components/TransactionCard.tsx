import { Download } from "lucide-react";

import { PaymentFilterStatus } from "@/common/enums";
import { SvgIcon } from "@/utility-components";
import { UserExternalPayment } from "@/interfaces/User";
import { TransactionStatus } from "./TransactionStatus";

interface TransactionCardProps {
  transaction: UserExternalPayment;
  onDownload: (transactionId: string) => void;
}

export function TransactionCard({
  transaction,
  onDownload,
}: TransactionCardProps) {
  const handleDownload = () => {
    onDownload(transaction.paymentId);
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="border-b-2 pb-2 flex flex-col">
        <div className="w-full flex items-center justify-between mb-2">
          <h1 className="text-lg">{transaction.paymentType}</h1>
          <span className="text-lg font-medium">
            &#8377;{transaction.amount}/-
          </span>
        </div>
        {transaction.connects ? (
          <div className="flex items-center">
            <SvgIcon iconSize="medium" name="coin" size={20} />
            <span className="text-xl font-medium text-gray-700">
              {transaction.connects}
            </span>
          </div>
        ) : null}
      </div>
      <div className="w-full flex justify-between items-center mt-4">
        {TransactionStatus(transaction.status)}

        {transaction.invoice ? (
          <button className="flex gap-2 items-center" onClick={handleDownload}>
            <span className="text-red-500">Download Invoice</span>
            <Download size={25} className="text-red-500" />
          </button>
        ) : transaction.status === PaymentFilterStatus.FAILED ? (
          <span className="text-red-500">Transaction Failed!</span>
        ) : (
          "Invoice: NA"
        )}
      </div>
    </div>
  );
}

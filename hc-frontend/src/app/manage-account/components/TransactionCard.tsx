import { ConnectBundleTitle } from "@/common/enums";
import { UserExternalPayment } from "@/interfaces/User";
import { SvgIcon } from "@/utility-components";

import { getStatusConfig } from "./statusConfig";

interface TransactionCardProps {
  transaction: UserExternalPayment;
  // onDownload: (transactionId: string) => void;
}

export function TransactionCard({
  transaction,
  // onDownload,
}: TransactionCardProps) {
  const statusInfo = getStatusConfig(transaction.status);
  const StatusIcon = statusInfo.icon;

  // const handleDownload = () => {
  //   onDownload(transaction.paymentId);
  // };

  const bundleKey = transaction.bundle as keyof typeof ConnectBundleTitle;

  return (
    <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="border-b-2 pb-2 flex flex-col">
        <div className="w-full flex items-center justify-between mb-2">
          <h1 className="text-lg">
            {ConnectBundleTitle[bundleKey] ?? "Unknown Bundle"}
          </h1>

          {transaction.connectQty ? (
            <div className="flex items-center">
              <SvgIcon iconSize="medium" name="coin" size={20} />
              <span className="text-xl font-medium text-gray-700">
                {transaction.connectQty}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="w-full flex justify-between items-center mt-4">
        {/* {TransactionStatus(transaction.status)} */}
        <div
          className={`inline-flex items-center gap-2 ${statusInfo.textClassName}`}
        >
          <StatusIcon
            size={statusInfo.iconSize}
            className={statusInfo.iconClassName}
          />
          <span>{statusInfo.label}</span>
        </div>

        <span className="text-lg font-medium">
          &#8377;{transaction.amount}/-
        </span>

        {/* {transaction.invoice ? (
          <button className="flex gap-2 items-center" onClick={handleDownload}>
            <span className="text-red-500">Download Invoice</span>
            <Download size={25} className="text-red-500" />
          </button>
        ) : transaction.status === PaymentFilterStatus.FAILED ? (
          <span className="text-red-500">Transaction Failed!</span>
        ) : (
          "Invoice: NA"
        )} */}
      </div>
    </div>
  );
}

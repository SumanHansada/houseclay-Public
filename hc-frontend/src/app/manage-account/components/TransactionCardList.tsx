import { useMemo } from "react";

import { MyTransaction } from "@/interfaces/ManageAccount";

import { formatDate, getDateKey } from "../utils";
import { TransactionCard } from "./TransactionCard";

interface TransactionCardListProps {
  items: MyTransaction[];
  onDownload: (transactionId: string) => void;
}

export function TransactionCardList({
  items,
  onDownload,
}: TransactionCardListProps) {
  const groupedTransactions = useMemo(() => {
    const grouped = items.reduce(
      (acc, transaction) => {
        const dateKey = getDateKey(transaction.dateTime);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
      },
      {} as Record<string, MyTransaction[]>,
    );

    const groupedArray = Object.entries(grouped)
      .map(([_, transactions]) => ({
        date: formatDate(transactions[0].dateTime),
        transactions: transactions.sort(
          (a, b) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
        ),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.transactions[0].dateTime).getTime();
        const dateB = new Date(b.transactions[0].dateTime).getTime();
        return dateB - dateA;
      });

    return groupedArray;
  }, [items]);

  return (
    <div className="space-y-8">
      {groupedTransactions.map((group) => (
        <div key={group.date} className="space-y-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {group.date}
          </h2>
          <div className="grid gap-4 grid-cols-1">
            {group.transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                {...transaction}
                onDownload={onDownload}
              />
            ))}
          </div>
        </div>
      ))}
      {groupedTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found
        </div>
      )}
    </div>
  );
}

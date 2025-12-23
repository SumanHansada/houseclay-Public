"use client";

import { useMemo } from "react";

import { formatUTCDateDisplay } from "@/common/utils";
import { UserExternalPayment } from "@/interfaces/User";

import { TransactionCard } from "./TransactionCard";

interface GroupedTransactions {
  date: string;
  transactions: UserExternalPayment[];
}

interface TransactionCardListProps {
  items: UserExternalPayment[];
  // onDownload: (transactionId: string) => void;
}

export function TransactionCardList({
  items,
  // onDownload,
}: TransactionCardListProps) {
  // backend guarantees items are already sorted
  const groupedTransactions = useMemo<GroupedTransactions[]>(() => {
    const groups: GroupedTransactions[] = [];
    if (!items || items.length === 0) return groups;

    let currentKey = "";
    for (let i = 0; i < items.length; i++) {
      const tx = items[i];
      const displayDate = formatUTCDateDisplay(tx.createdAt);
      if (displayDate !== currentKey) {
        currentKey = displayDate;
        groups.push({
          date: displayDate,
          transactions: [tx],
        });
      } else {
        groups[groups.length - 1].transactions.push(tx);
      }
    }
    return groups.reverse();
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
                key={transaction.paymentId}
                transaction={transaction}
                // onDownload={onDownload}
              />
            ))}
          </div>
        </div>
      ))}
      {groupedTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
}

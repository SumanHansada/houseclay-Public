"use client";

import { useMemo, useState } from "react";

import { PaymentFilterStatus } from "@/common/enums";

import { TransactionTable } from "../components/TransactionTable";
import { DUMMY_PAYMENTS } from "../dummy";

const FILTERS = [
  { key: PaymentFilterStatus.ALL, label: "All" },
  { key: PaymentFilterStatus.COMPLETED, label: "Completed" },
  { key: PaymentFilterStatus.CANCELLED, label: "Cancelled" },
];

export default function MyPaymentsPage() {
  const [selected, setSelected] = useState<PaymentFilterStatus>(
    PaymentFilterStatus.ALL,
  );

  const filtered = useMemo(() => {
    return DUMMY_PAYMENTS.filter((p) => {
      if (selected !== PaymentFilterStatus.ALL && p.status !== selected)
        return false;
      return true;
    });
  }, [selected]);

  return (
    <main>
      {/* Header */}
      <div className="border-b-2 pb-2 mb-8 flex justify-between">
        <h1 className="text-2xl font-medium">Your payments</h1>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3 text-lg font-medium text-gray-700 mb-8 overflow-x-auto">
        {FILTERS.map((f) => {
          const active = selected === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setSelected(f.key)}
              aria-pressed={active}
              className={`px-4 py-2 rounded-lg border shadow-sm whitespace-nowrap ${
                active ? "bg-red-500 text-white border-red-500" : "bg-white"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <TransactionTable transactions={filtered} />
      </div>
    </main>
  );
}

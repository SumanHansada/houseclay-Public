"use client";

import { useMemo, useState } from "react";

import { PaymentFilterStatus } from "@/common/enums";
import { MobileHeader } from "@/layout-components";

import { TransactionCardList } from "../components/TransactionCardList";
import { TransactionTable } from "../components/TransactionTable";
import { DUMMY_PAYMENTS } from "../dummy";

const filterOptions = [
  { label: "All", value: PaymentFilterStatus.ALL },
  { label: "Completed", value: PaymentFilterStatus.COMPLETED },
  { label: "Cancelled", value: PaymentFilterStatus.CANCELLED },
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

  const onDownload = (id: string) => {
    console.log("Download Invoice: ", id);
  };

  return (
    <main>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <div className="border-b-2 pb-2 mb-8 flex justify-between">
          <h1 className="text-2xl font-medium">Your payments</h1>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 text-lg font-medium text-gray-700 mb-8">
          {filterOptions.map((f) => {
            const active = selected === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelected(f.value)}
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
      </section>

      {/* Mobile */}
      <section className="md:hidden">
        {/* Header */}
        <MobileHeader title="Your payments" />

        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-8">
          {filterOptions.map((f) => {
            const active = selected === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelected(f.value)}
                aria-pressed={active}
                className={`px-2 py-1 sm:px-4 sm:py-2 flex-1 whitespace-nowrap ${
                  active ? "border border-red-500 text-red-500 rounded-lg" : ""
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="hidden 2xl:block">
        <TransactionTable transactions={filtered} onDownload={onDownload} />
      </div>

      <div className="2xl:hidden max-md:px-8 mb-16 py-5">
        <TransactionCardList items={filtered} onDownload={onDownload} />
      </div>
    </main>
  );
}

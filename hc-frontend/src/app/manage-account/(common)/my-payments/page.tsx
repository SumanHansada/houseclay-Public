"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { PaymentFilterStatus } from "@/common/enums";
import { RootState } from "@/store/store";

import { TransactionCardList } from "../../components/TransactionCardList";
import { TransactionTable } from "../../components/TransactionTable";
import Loading from "./loading";

const filterOptions = [
  { label: "All", value: PaymentFilterStatus.ALL },
  { label: "Completed", value: PaymentFilterStatus.COMPLETED },
  { label: "Failed", value: PaymentFilterStatus.FAILED },
];

export default function MyPaymentsPage() {
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilterStatus>(
    PaymentFilterStatus.ALL,
  );
  const { userDetail, userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );

  const externalPayments = userDetail.externalPayments;

  const filteredPayments = externalPayments.filter((prop) => {
    if (
      selectedFilter !== PaymentFilterStatus.ALL &&
      prop.status !== selectedFilter
    )
      return false;
    return true;
  });

  // const onDownload = (id: string) => {
  //   console.log("Download Invoice: ", id);
  // };

  // console.log("externalPayments: ", externalPayments);
  // console.log("filteredPayments: ", filteredPayments);

  if (userDetailLoading || userDetailError) {
    return <Loading />;
  }

  return (
    <section>
      {/* Desktop */}
      <section className="max-md:hidden">
        {/* Header */}
        <div className="border-b-2 pb-2 mb-8 flex justify-between">
          <h1 className="text-2xl font-medium">Your payments</h1>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 text-lg font-medium text-gray-700 mb-8">
          {filterOptions.map((f) => {
            const active = selectedFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFilter(f.value)}
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
        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-4">
          {filterOptions.map((f) => {
            const active = selectedFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFilter(f.value)}
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
        <TransactionTable
          transactions={filteredPayments}
          // onDownload={onDownload}
        />
      </div>

      <div className="2xl:hidden max-md:px-6 pt-4 pb-16">
        <TransactionCardList
          items={filteredPayments}
          // onDownload={onDownload}
        />
      </div>
    </section>
  );
}

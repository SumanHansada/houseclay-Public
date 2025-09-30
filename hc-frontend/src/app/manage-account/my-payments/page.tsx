"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { PaymentFilterStatus } from "@/common/enums";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useGetUserDetailQuery } from "@/store/apiSlice";
import { setHideStickyNavBar } from "@/store/appSlice";

import { TransactionCardList } from "../components/TransactionCardList";
import { TransactionTable } from "../components/TransactionTable";
import Loading from "./loading";

const filterOptions = [
  { label: "All", value: PaymentFilterStatus.ALL },
  { label: "Completed", value: PaymentFilterStatus.COMPLETED },
  { label: "Failed", value: PaymentFilterStatus.FAILED },
];

export default function MyPaymentsPage() {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  const [selectedFilter, setSelectedFilter] = useState<PaymentFilterStatus>(
    PaymentFilterStatus.ALL,
  );
  const { data, isLoading, error } = useGetUserDetailQuery();

  const externalPayments = useMemo(
    () => data?.user?.externalPayments ?? [],
    [data],
  );

  const filteredPayments = useMemo(() => {
    return externalPayments.filter((prop) => {
      if (
        selectedFilter !== PaymentFilterStatus.ALL &&
        prop.status !== selectedFilter
      )
        return false;
      return true;
    });
  }, [externalPayments, selectedFilter]);

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideStickyNavBar(false));
    } else {
      dispatch(setHideStickyNavBar(true));
    }
  }, [isMobile, dispatch]);

  const onDownload = (id: string) => {
    console.log("Download Invoice: ", id);
  };

  console.log("externalPayments: " + externalPayments);
  console.log("filteredPayments: " + filteredPayments);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading payments</div>;
  }

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
        {/* Header */}
        <MobileHeader title="Your payments" />

        {/* Filter buttons */}
        <div className="flex justify-between text-lg m-3 border p-1.5 sm:p-2 rounded-xl mx-8">
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
          onDownload={onDownload}
        />
      </div>

      <div className="2xl:hidden max-md:px-6 pt-4 pb-16">
        <TransactionCardList items={filteredPayments} onDownload={onDownload} />
      </div>
    </main>
  );
}

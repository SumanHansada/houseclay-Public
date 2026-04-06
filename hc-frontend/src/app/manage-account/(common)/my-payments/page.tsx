"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
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

const tabTween = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

const listCrossfade = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1] as const,
};

export default function MyPaymentsPage() {
  const reduceMotion = useReducedMotion();
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilterStatus>(
    PaymentFilterStatus.ALL,
  );
  const { userDetail, userDetailLoading, userDetailError } = useSelector(
    (state: RootState) => state.user,
  );

  const externalPayments = userDetail.externalPayments;

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

  const activeFilterIndex = Math.max(
    0,
    filterOptions.findIndex((f) => f.value === selectedFilter),
  );

  const listPresenceKey = selectedFilter;

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
        <div className="m-3 mx-4 rounded-xl border border-gray-200 bg-gray-50/80 p-1.5 text-lg sm:p-2">
          <div className="relative flex min-h-10 sm:min-h-11">
            <motion.div
              className="pointer-events-none absolute inset-y-0 left-0 z-0 rounded-lg border border-red-500 bg-white shadow-sm"
              initial={false}
              style={{
                width: `${100 / filterOptions.length}%`,
              }}
              animate={{
                left: `${(activeFilterIndex / filterOptions.length) * 100}%`,
              }}
              transition={
                reduceMotion ? { duration: 0, ease: "linear" } : tabTween
              }
              aria-hidden
            />
            {filterOptions.map((f) => {
              const active = selectedFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setSelectedFilter(f.value)}
                  aria-pressed={active}
                  className="relative z-10 flex flex-1 items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 sm:px-4 sm:py-2"
                >
                  <span
                    className={`text-sm font-medium sm:text-base ${
                      active ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto hidden w-full [grid-template-areas:'stack'] 2xl:grid">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={listPresenceKey}
            className="[grid-area:stack] w-full min-w-0"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : listCrossfade}
          >
            <TransactionTable
              transactions={filteredPayments}
              // onDownload={onDownload}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto grid w-full [grid-template-areas:'stack'] 2xl:hidden max-md:px-6 pt-4 pb-16">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={listPresenceKey}
            className="[grid-area:stack] w-full min-w-0"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : listCrossfade}
          >
            <TransactionCardList
              items={filteredPayments}
              // onDownload={onDownload}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

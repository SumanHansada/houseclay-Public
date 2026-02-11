"use client";
import { ArrowDownToLine } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { RenderPaymentStatus } from "@/components/status/RenderPaymentStatus";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { UserExternalPayment } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

interface RowType extends UserExternalPayment {
  _serial: number;
}

const PaymentHistory: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };

  const { data, isLoading } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });

  // parent layout already ensures data is present
  const { externalPayments = [] } = data!.user;

  const rows: RowType[] = externalPayments.map((paymentInfo, index) => ({
    ...paymentInfo,
    _serial: index + 1,
  }));

  const { currentPage, paginatedRows, totalPages, goToPage } =
    useLocalPagination(rows, 10);

  const columns: Column<RowType>[] = [
    {
      key: "_serial",
      label: "#",
      accessor: "_serial",
      className: "w-20",
    },
    {
      key: "amount",
      label: "Amount",
      accessor: "amount",
    },
    {
      key: "createdAt",
      label: "Created At",
      accessor: "createdAt",
      render: (payment) => new Date(payment.createdAt).toLocaleString("en-IN"),
    },
    {
      key: "completedAt",
      label: "Completed At",
      accessor: "completedAt",
      render: (payment) =>
        payment.completedAt ? (
          new Date(payment.completedAt).toLocaleString("en-IN")
        ) : (
          <div>N/A</div>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (payment) => <RenderPaymentStatus status={payment.status} />,
    },
    {
      key: "invoice",
      label: "Invoice",
      render: () => (
        <div>
          <ArrowDownToLine />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        {/* Main Content Area */}
        <div className="bg-gray-100 flex-1 p-8">
          <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col gap-4 h-full relative">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="bg-white p-4 rounded-full shadow-lg border flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-gray-700">
                External Payment History
              </h2>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Opacity Wrapper */}
              <div
                className={
                  isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
                }
              >
                <DataTable<RowType>
                  columns={columns}
                  data={paginatedRows}
                  getRowId={(row) => row.paymentId}
                  noDataMessage="No transactions found."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Pagination */}
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white py-4 px-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;

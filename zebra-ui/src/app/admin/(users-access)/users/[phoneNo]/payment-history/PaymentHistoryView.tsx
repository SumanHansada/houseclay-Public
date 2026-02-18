"use client";

import { ArrowDownToLine } from "lucide-react";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { RenderPaymentStatus } from "@/components/status/RenderPaymentStatus";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { UserExternalPayment } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

interface RowType extends UserExternalPayment {
  _serial: number;
}

export const PaymentHistoryView = ({
  userPhoneNo,
}: {
  userPhoneNo: string;
}) => {
  const { data, isLoading } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });

  // parent layout already ensures data is present
  const externalPayments = data?.user?.externalPayments || [];

  const rows: RowType[] = externalPayments.map((paymentInfo, index) => ({
    ...paymentInfo,
    _serial: index + 1,
  }));

  const { currentPage, paginatedRows, totalPages, goToPage } =
    useLocalPagination(rows, 10);

  if (!data?.user && !isLoading) return null;

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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white shadow-sm rounded-xl p-2 gap-2 relative overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl font-medium text-gray-700">
              External Payment History
            </h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {/* Table Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <DataTable<RowType>
              columns={columns}
              data={paginatedRows}
              getRowId={(row) => row.paymentId}
              noDataMessage="No transactions found."
              isLoading={isLoading}
            />
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
  );
};

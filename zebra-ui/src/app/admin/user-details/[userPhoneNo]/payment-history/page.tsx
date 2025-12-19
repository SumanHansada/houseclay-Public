"use client";
import { ArrowDownToLine } from "lucide-react";
import { useParams } from "next/navigation";
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
      label: "Sr. No.",
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
        <div className="bg-gray-100 flex-1 py-8 px-16">
          <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4 h-full">
            <h2 className="text-3xl">External Payment History</h2>
            <DataTable<RowType>
              columns={columns}
              data={paginatedRows}
              getRowId={(row) => row.paymentId}
            />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
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

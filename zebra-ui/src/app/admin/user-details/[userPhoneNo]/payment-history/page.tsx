"use client";
import { ArrowDownToLine } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { PaginationFooter } from "@/components/PaginationFooter";
import { UserExternalPayment } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

import { RenderPaymentStatus } from "../../components/RenderPaymentStatus";

interface RowType extends UserExternalPayment {
  _serial: number;
}

const PaymentHistory: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { externalPayments } = data!.user;

  const rows: RowType[] = externalPayments.map((paymentInfo, index) => ({
    ...paymentInfo,
    _serial: index + 1,
  }));

  const rowsPerPage = 10;
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage >= totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

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
          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            isFirst={isFirst}
            isLast={isLast}
            goToPage={goToPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;

"use client";
import { ArrowDownToLine } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { TablePagination } from "@/components/TablePagination";
import { UserConnectTransaction } from "@/interfaces/User";
import { useParams } from "next/navigation";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

interface RowType extends UserConnectTransaction {
  _serial: number;
}

const ConnectHistoryPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { connectTransactions } = data!.user;

  const rows: RowType[] = connectTransactions.map((transactionInfo, index) => ({
    ...transactionInfo,
    _serial: index + 1,
  }));

  const rowsPerPage = 10;
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage]);

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
      key: "connectQuantity",
      label: "Connects Quantity",
      accessor: "connectQuantity",
    },
    {
      key: "transactionTime",
      label: "Transaction Time",
      accessor: "transactionTime",
      render: (connectInfo) =>
        new Date(connectInfo.transactionTime).toLocaleString(),
    },
    {
      key: "invoice",
      label: "Invoice",
      render: () => (
        <div className="hover:cursor-pointer">
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
            <h2 className="text-3xl">Connect History</h2>
            <DataTable<RowType>
              columns={columns}
              data={paginatedRows}
              getRowId={(row) => row.transactionId}
            />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
          <TablePagination
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

export default ConnectHistoryPage;

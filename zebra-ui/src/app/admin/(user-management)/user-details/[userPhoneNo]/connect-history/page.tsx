"use client";
import { ArrowDownToLine } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import { Column, DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { useLocalPagination } from "@/hooks/useLocalPagination";
import { UserConnectTransaction } from "@/interfaces/User";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";

interface RowType extends UserConnectTransaction {
  _serial: number;
}

const ConnectHistoryPage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data, isLoading } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });

  // parent layout already ensures data is present
  const { connectTransactions = [] } = data!.user;

  const rows: RowType[] = connectTransactions.map((transactionInfo, index) => ({
    ...transactionInfo,
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
      key: "connectQuantity",
      label: "Connects Quantity",
      accessor: "connectQuantity",
    },
    {
      key: "transactionTime",
      label: "Transaction Time",
      accessor: "transactionTime",
      render: (connectInfo) =>
        new Date(connectInfo.transactionTime).toLocaleString("en-IN"),
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

export default ConnectHistoryPage;

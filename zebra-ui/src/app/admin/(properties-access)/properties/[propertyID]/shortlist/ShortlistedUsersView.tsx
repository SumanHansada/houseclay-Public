"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { LocalPaginatedTable } from "@/components/LocalPaginatedTable";
import { UserInfo } from "@/interfaces/User";
import { useGetPropertyByIdQuery } from "@/store/apiSlice";
import { buildUserColumns } from "@/utils/tableColumnBuilders";

interface SerializedUserRow extends UserInfo {
  _serial: number;
}

export const ShortlistedUsersView = ({
  propertyID,
}: {
  propertyID: string;
}) => {
  const router = useRouter();
  const { data: currentProperty, isLoading } = useGetPropertyByIdQuery({
    propertyID: propertyID,
  });

  // parent layout already ensures data is present
  if (!currentProperty) return null;
  const { shortlistUsers = [] } = currentProperty;

  const rows: SerializedUserRow[] = shortlistUsers.map((userInfo, index) => ({
    ...userInfo,
    _serial: index + 1,
  }));

  const viewProfile = (row: SerializedUserRow) =>
    router.push(`/admin/users/${row.phoneNo}`);

  const columns = buildUserColumns([
    {
      icon: Eye,
      tooltip: "View User Details",
      onClick: viewProfile,
    },
  ]);

  return (
    <LocalPaginatedTable
      tableTitle="Shortlist Users"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.phoneNo}
      noDataMessage="No shortlisted users found."
      isLoading={isLoading}
    />
  );
};

"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { UserDetailsTabEnum } from "@/common/enums";
import { LocalPaginatedTable } from "@/components/LocalPaginatedTable";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/tableColumnBuilders";
import { userDetailsTestIds } from "@/utils/testIds";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

export const OwnedPropertiesView = ({
  userPhoneNo,
}: {
  userPhoneNo: string;
}) => {
  const router = useRouter();
  const { data, isLoading } = useGetUserByPhoneNoQuery({
    phoneNo: userPhoneNo,
  });

  // parent layout already ensures data is present
  if (!data?.user) return null;
  const { ownedProperties = [] } = data.user;

  const rows: SerializedPropertyRow[] = ownedProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: index + 1,
    }),
  );

  const handleView = (row: SerializedPropertyRow) => {
    router.push(`/admin/properties/${row.propertyID}`);
  };

  const columns = buildPropertyColumns([
    {
      icon: Eye,
      tooltip: "View Property Details",
      onClick: handleView,
    },
  ]);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      data-testid={userDetailsTestIds.getTabPageId(UserDetailsTabEnum.OWNED)}
    >
      <LocalPaginatedTable
        tableTitle="Owned Properties"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.propertyID}
        noDataMessage="No owned properties found."
        isLoading={isLoading}
      />
    </div>
  );
};

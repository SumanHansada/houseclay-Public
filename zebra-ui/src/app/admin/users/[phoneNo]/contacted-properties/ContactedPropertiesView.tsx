"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { LocalPaginatedTable } from "@/components/LocalPaginatedTable";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/tableColumnBuilders";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

export const ContactedPropertiesView = ({
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
  const { contactedProperties = [] } = data.user;

  const rows: SerializedPropertyRow[] = contactedProperties.map(
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <LocalPaginatedTable
        tableTitle="Contacted Properties"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.propertyID}
        noDataMessage="No contacted properties found."
        isLoading={isLoading}
      />
    </div>
  );
};

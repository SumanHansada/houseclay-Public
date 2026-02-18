"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/buildPropertyColumns";

import { PaginatedPropertiesTable } from "../../components/PaginatedPropertiesTable";

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
    router.push(
      `/admin/property-details/${row.propertyCategory.toLowerCase()}/${row.propertyID}`,
    );
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
      <PaginatedPropertiesTable
        tableTitle="Contacted Properties"
        columns={columns}
        rows={rows}
        isLoading={isLoading}
      />
    </div>
  );
};

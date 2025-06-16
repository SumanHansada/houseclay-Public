"use client";

import { Column, DataTable } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";
import {
  dummyGetPropertiesToBeReVerified,
  dummyGetPropertiesToBeVerified,
} from "@/mock/getAllProperties";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { RenderPropertyStatus } from "../../user-details/components/RenderPropertyStatus";
import { TableCellActions } from "../../user-details/components/TableCellActions";
import { VerifyPropertyStatusEnum } from "@/common/enums";
import { createCommonColumns } from "../../user-details/[userPhoneNo]/propertyColumns";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

const PropertyVerificationTable: React.FC = () => {
  const router = useRouter();
  const { status } = useParams() as { status: VerifyPropertyStatusEnum };
  const data =
    status === "pending"
      ? dummyGetPropertiesToBeVerified
      : dummyGetPropertiesToBeReVerified;

  const allProperties = useMemo<PropertyInfo[]>(() => {
    return data?.content ?? [];
  }, [data?.content]);

  const viewPropertyDetails = (type: string, propertyID: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}`);
  };

  const rows: PropertyRow[] = allProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const columns: Column<PropertyRow>[] =
    createCommonColumns(viewPropertyDetails);
  // const columns: Column<PropertyRow>[] = [
  //   {
  //     key: "serial",
  //     label: "Sr. No.",
  //     accessor: "_serial",
  //     className: "w-20",
  //   },
  //   {
  //     key: "location",
  //     label: "Location",
  //     accessor: "location",
  //   },
  //   {
  //     key: "type",
  //     label: "Type",
  //     accessor: "type",
  //   },
  //   {
  //     key: "config",
  //     label: "Config",
  //     accessor: "config",
  //   },
  //   {
  //     key: "createdAt",
  //     label: "Last Modified",
  //     render: (p) =>
  //       p.lastModified
  //         ? new Date(p.lastModified).toLocaleString()
  //         : new Date(p.createdAt).toLocaleString(),
  //   },
  //   {
  //     key: "availableFrom",
  //     label: "Available From",
  //     render: (p) => new Date(p.availableFrom).toLocaleString(),
  //   },
  //   {
  //     key: "status",
  //     label: "Status",
  //     render: (p) => <RenderPropertyStatus status={p.status} />,
  //   },
  //   {
  //     key: "action",
  //     label: "Action",
  //     render: (p) => (
  //       <TableCellActions
  //         viewDetails={() => viewPropertyDetails(p.type, p.propertyID)}
  //       />
  //     ),
  //   },
  // ];

  return (
    <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4 gap-4">
      <h1 className="text-3xl">
        {status === VerifyPropertyStatusEnum.VERIFY
          ? "Properties to be Verified"
          : "Properties to be Re-verified"}
      </h1>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(prop) => prop.propertyID}
      />
    </div>
  );
};

export default PropertyVerificationTable;

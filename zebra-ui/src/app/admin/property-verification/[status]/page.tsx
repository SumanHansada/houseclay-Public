"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { VerifyPropertyStatusEnum } from "@/common/enums";
import { Column, DataTable } from "@/components/DataTable";
import { PropertyInfo } from "@/interfaces/Property";
import {
  dummyGetPropertiesToBeReVerified,
  dummyGetPropertiesToBeVerified,
} from "@/mock/propertyDetailsDummy";

import { createCommonColumns } from "@/utils/commonPropertyColumns";

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

  return (
    <div className="flex flex-col flex-1 bg-white shadow-sm rounded-xl p-4 gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl">
          {status === VerifyPropertyStatusEnum.VERIFY
            ? "Properties to be Verified"
            : "Properties to be Re-verified"}
        </h1>
        <div className="flex gap-3 items-center">
          <h1 className="text-2xl font-medium">Status:</h1>
          <button
            className={`py-2 px-3 rounded-xl border border-red-500 ${status === VerifyPropertyStatusEnum.VERIFY ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
            onClick={() =>
              router.push(
                `/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`,
              )
            }
          >
            Pending
          </button>
          <button
            className={`py-2 px-3 rounded-xl border border-red-500 ${status === VerifyPropertyStatusEnum.REVERIFY ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
            onClick={() =>
              router.push(
                `/admin/property-verification/${VerifyPropertyStatusEnum.REVERIFY}`,
              )
            }
          >
            Reported
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(prop) => prop.propertyID}
      />
    </div>
  );
};

export default PropertyVerificationTable;

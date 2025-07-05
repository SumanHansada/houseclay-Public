"use client";

import { useParams, useRouter } from "next/navigation";

import { PropertyInfo } from "@/interfaces/Property";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/table/buildPropertyColumns";

import { PropertiesTableView } from "../../components/PropertiesTableView";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}

const ViewedPropertiesPage: React.FC = () => {
  const router = useRouter();
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { viewedProperties } = data!.user;

  const viewPropertyDetails = (type: string, propertyID: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}`);
  };

  const rows: PropertyRow[] = viewedProperties.map((propertyInfo, index) => ({
    ...propertyInfo,
    _serial: index + 1,
  }));

  const columns = buildPropertyColumns(viewPropertyDetails);

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="Viewed Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ViewedPropertiesPage;

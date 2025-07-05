"use client";
import { useParams, useRouter } from "next/navigation";

import { PropertyInfo } from "@/interfaces/Property";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import { buildPropertyColumns } from "@/utils/table/buildPropertyColumns";

import { PropertiesTableView } from "../../components/PropertiesTableView";

interface PropertyRow extends PropertyInfo {
  _serial: number;
}
const ContactedPropertiesPage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { contactedProperties } = data!.user;

  const viewPropertyDetails = (type: string, propertyID: string) => {
    router.push(`/admin/property-details/${type}/${propertyID}`);
  };

  const rows: PropertyRow[] = contactedProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: index + 1,
    }),
  );

  const columns = buildPropertyColumns(viewPropertyDetails);

  return (
    <div className="h-full">
      <PropertiesTableView
        tableTitle="Contacted Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default ContactedPropertiesPage;

"use client";
import { useParams, useRouter } from "next/navigation";

import { UserDetailsTabEnum } from "@/common/enums";
import { PropertyInfo } from "@/interfaces/PropertyInfo";
import { useGetUserByPhoneNoQuery } from "@/store/apiSlice";
import {
  buildPropertyColumns,
  createDefaultPropertyActions,
} from "@/utils/table/buildPropertyColumns";
import { userDetailsTestIds } from "@/utils/testIds";

import { PropertiesTableView } from "../../components/PropertiesTableView";

interface SerializedPropertyRow extends PropertyInfo {
  _serial: number;
}

const OwnedPropertiesPage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };
  const router = useRouter();
  const { data } = useGetUserByPhoneNoQuery({ phoneNo: userPhoneNo });

  const { ownedProperties } = data!.user;

  const rows: SerializedPropertyRow[] = ownedProperties.map(
    (propertyInfo, index) => ({
      ...propertyInfo,
      _serial: index + 1,
    }),
  );

  const viewPropertyDetails = (
    propertyCategory: string,
    propertyID: string,
  ) => {
    router.push(
      `/admin/property-details/${propertyCategory.toLowerCase()}/${propertyID}`,
    );
  };

  const columns = buildPropertyColumns(
    createDefaultPropertyActions({
      onView: (row) =>
        viewPropertyDetails(row.propertyCategory, row.propertyID),
    }),
  );

  return (
    <div
      className="h-full"
      data-testid={userDetailsTestIds.getTabPageId(UserDetailsTabEnum.OWNED)}
    >
      <PropertiesTableView
        tableTitle="Owned Properties"
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default OwnedPropertiesPage;

import React from "react";
import { ListProperties } from "./ListProperties";
import { dummyGetAllProperties } from "@/mock/getAllProperties";

const ViewAllPropertyPage: React.FC = () => {
  //   const { data, isLoading, isError } = useGetPropertiesQuery({
  //     page: currentPage - 1,
  //     size: rowsPerPage,
  //   });
  const data = dummyGetAllProperties;
  return <ListProperties propertyList={data} />;
};

export default ViewAllPropertyPage;

import React from "react";
import { UsersManagement } from "./components/UserManagement";
import { default as UserData } from "@/data/dummyData.json";
import { TUser } from "@/common/Types";

const UserManagementPage: React.FC = async () => {
  // const users: TUser[] = UserData;
  return <UsersManagement />;
};

export default UserManagementPage;

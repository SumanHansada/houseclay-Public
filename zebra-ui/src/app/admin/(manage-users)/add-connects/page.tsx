import React from "react";

import { PERMISSIONS } from "@/common/permissions";
import RoleGuard from "@/components/RoleGuard";

import { AddConnects } from "./AddConnects";

const UserManagementPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={PERMISSIONS.ADD_CONNECTS}>
      <AddConnects />
    </RoleGuard>
  );
};

export default UserManagementPage;

import React from "react";

import { PERMISSIONS } from "@/common/permissions";
import RoleGuard from "@/components/RoleGuard";

import { AddConnectsForm } from "./AddConnectsForm";

const AddConnectsPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={PERMISSIONS.ADD_CONNECTS}>
      <AddConnectsForm />
    </RoleGuard>
  );
};

export default AddConnectsPage;

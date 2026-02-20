import { PERMISSIONS } from "@/common/permissions";
import RoleGuard from "@/components/RoleGuard";

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={PERMISSIONS.USERS_ACCESS}>{children}</RoleGuard>
  );
}

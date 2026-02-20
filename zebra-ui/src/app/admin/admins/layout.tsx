import { PERMISSIONS } from "@/common/permissions";
import RoleGuard from "@/components/RoleGuard";

export default function AdminManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={PERMISSIONS.ADMINS_ACCESS}>{children}</RoleGuard>
  );
}

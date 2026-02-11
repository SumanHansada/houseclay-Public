import { PERMISSIONS } from "@/common/permissions";
import RoleGuard from "@/components/RoleGuard";

export default function PropertyManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={PERMISSIONS.PROPERTY_MANAGEMENT}>
      {children}
    </RoleGuard>
  );
}

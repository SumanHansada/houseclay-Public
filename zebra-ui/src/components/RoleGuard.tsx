"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Spinner from "@/components/Spinner";
import { AdminRole } from "@/interfaces/AdminAuth";
import { RootState } from "@/store/store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AdminRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { role, isAuthenticated, isAuthLoading } = useSelector(
    (state: RootState) => state.adminAuth,
  );
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) return;

    // Check Role
    if (role && !allowedRoles.includes(role)) {
      router.replace("/admin/unauthorized");
    }
  }, [isAuthenticated, isAuthLoading, role, allowedRoles, router]);

  // Still loading session (Prevent hydration mismatch)
  if (isAuthLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }
  // Role Mismatch (Redirecting... show nothing or a "Forbidden" skeleton)
  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}

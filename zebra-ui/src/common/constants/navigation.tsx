import { Home, UserCheck, Users } from "lucide-react";
import { ReactNode } from "react";

import { ADMIN_ROLES, AdminRole } from "@/interfaces/AdminAuth";

export interface SidebarChild {
  label: string;
  href: string;
  allowedRoles?: AdminRole[];
}

export interface SidebarItem {
  label: string;
  icon: ReactNode;
  href: string;
  children: SidebarChild[];
  allowedRoles?: AdminRole[];
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Properties",
    icon: <Home size={20} />,
    href: "#",
    allowedRoles: [
      ADMIN_ROLES.SUPER_ADMIN,
      ADMIN_ROLES.MANAGER,
      ADMIN_ROLES.CAPTAIN,
    ],
    children: [
      { label: "View All Properties", href: "/admin/view-all-properties" },
      { label: "Property Verification", href: "/admin/property-verification" },
    ],
  },
  {
    label: "Lead Management",
    icon: <UserCheck size={20} />,
    href: "#",
    allowedRoles: [
      ADMIN_ROLES.SUPER_ADMIN,
      ADMIN_ROLES.MANAGER,
      ADMIN_ROLES.CAPTAIN,
    ],
    children: [
      { label: "Property Lead", href: "/admin/lead-management/property" },
      { label: "Support Lead", href: "/admin/lead-management/support" },
      { label: "Upgrade Property", href: "/admin/lead-management/upgrade" },
    ],
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    href: "#",
    allowedRoles: [
      ADMIN_ROLES.SUPER_ADMIN,
      ADMIN_ROLES.MANAGER,
      ADMIN_ROLES.CAPTAIN,
    ],
    children: [
      { label: "HouseClay Users", href: "/admin/user-management" },
      {
        label: "Add new Zebra user",
        href: "/admin/add-zebra-user",
        allowedRoles: [ADMIN_ROLES.SUPER_ADMIN],
      },
      {
        label: "Add connects",
        href: "/admin/add-connects",
        allowedRoles: [ADMIN_ROLES.SUPER_ADMIN],
      },
    ],
  },
];

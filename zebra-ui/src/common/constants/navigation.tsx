import { Home, UserCheck, UserLock, Users } from "lucide-react";
import { ReactNode } from "react";

import { AdminRole } from "@/interfaces/AdminAuth";

import { PERMISSIONS } from "../permissions";

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
    allowedRoles: PERMISSIONS.PROPERTY_MANAGEMENT,
    children: [
      {
        label: "View All Properties",
        href: "/admin/view-all-properties",
        allowedRoles: PERMISSIONS.PROPERTY_MANAGEMENT,
      },
      {
        label: "Property Verification",
        href: "/admin/property-verification",
        allowedRoles: PERMISSIONS.PROPERTY_MANAGEMENT,
      },
    ],
  },
  {
    label: "Lead Management",
    icon: <UserCheck size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.MANAGE_LEADS,
    children: [
      {
        label: "Property Lead",
        href: "/admin/lead-management/property",
        allowedRoles: PERMISSIONS.MANAGE_LEADS,
      },
      {
        label: "Support Lead",
        href: "/admin/lead-management/support",
        allowedRoles: PERMISSIONS.MANAGE_LEADS,
      },
      {
        label: "Upgrade Property",
        href: "/admin/lead-management/upgrade",
        allowedRoles: PERMISSIONS.MANAGE_LEADS,
      },
    ],
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.USER_MANAGEMENT,
    children: [
      {
        label: "List All - Houseclay Users",
        href: "/admin/list-all-users",
        allowedRoles: PERMISSIONS.USER_MANAGEMENT,
      },
      {
        label: "Add connects",
        href: "/admin/add-connects",
        allowedRoles: PERMISSIONS.ADD_CONNECTS,
      },
    ],
  },
  {
    label: "Admin Management",
    icon: <UserLock size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.ADMIN_MANAGEMENT,
    children: [
      {
        label: "List All - Zebra Admins",
        href: "/admin/list-all-admins",
        allowedRoles: PERMISSIONS.ADMIN_MANAGEMENT,
      },
      {
        label: "Add new Zebra user",
        href: "/admin/add-zebra-user",
        allowedRoles: PERMISSIONS.ADMIN_MANAGEMENT,
      },
    ],
  },
];

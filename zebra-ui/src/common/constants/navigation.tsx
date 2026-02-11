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
    allowedRoles: PERMISSIONS.MANAGE_PROPERTIES,
    children: [
      {
        label: "View All Properties",
        href: "/admin/view-all-properties",
        allowedRoles: PERMISSIONS.MANAGE_PROPERTIES,
      },
      {
        label: "Property Verification",
        href: "/admin/property-verification",
        allowedRoles: PERMISSIONS.MANAGE_PROPERTIES,
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
    allowedRoles: PERMISSIONS.MANAGE_USERS,
    children: [
      {
        label: "Houseclay Users",
        href: "/admin/user-management",
        allowedRoles: PERMISSIONS.MANAGE_USERS,
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
    allowedRoles: PERMISSIONS.MANAGE_ADMINS,
    children: [
      {
        label: "Zebra Users",
        href: "/admin/admin-management",
        allowedRoles: PERMISSIONS.MANAGE_ADMINS,
      },
      {
        label: "Add new Zebra user",
        href: "/admin/add-zebra-user",
        allowedRoles: PERMISSIONS.MANAGE_ADMINS,
      },
    ],
  },
];

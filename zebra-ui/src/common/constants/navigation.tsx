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
    label: "Property Management",
    icon: <Home size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.PROPERTIES_ACCESS,
    children: [
      {
        label: "Properties - Table View",
        href: "/admin/properties",
        allowedRoles: PERMISSIONS.PROPERTIES_ACCESS,
      },
      {
        label: "Property Verification",
        href: "/admin/property-verification",
        allowedRoles: PERMISSIONS.PROPERTIES_ACCESS,
      },
    ],
  },
  {
    label: "Lead Management",
    icon: <UserCheck size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.LEADS_ACCESS,
    children: [
      {
        label: "Property Leads",
        href: "/admin/leads/property",
        allowedRoles: PERMISSIONS.LEADS_ACCESS,
      },
      {
        label: "Support Leads",
        href: "/admin/leads/support",
        allowedRoles: PERMISSIONS.LEADS_ACCESS,
      },
      {
        label: "Upgrade Property Leads",
        href: "/admin/leads/upgrade",
        allowedRoles: PERMISSIONS.LEADS_ACCESS,
      },
    ],
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.USERS_ACCESS,
    children: [
      {
        label: "Houseclay Users - Table View",
        href: "/admin/users",
        allowedRoles: PERMISSIONS.USERS_ACCESS,
      },
      {
        label: "Add connects",
        href: "/admin/users/add-connects",
        allowedRoles: PERMISSIONS.ADD_CONNECTS,
      },
    ],
  },
  {
    label: "Admin Management",
    icon: <UserLock size={20} />,
    href: "#",
    allowedRoles: PERMISSIONS.ADMINS_ACCESS,
    children: [
      {
        label: "Zebra Admins - Table View",
        href: "/admin/admins",
        allowedRoles: PERMISSIONS.ADMINS_ACCESS,
      },
      {
        label: "Add new Zebra user",
        href: "/admin/admins/add-admin",
        allowedRoles: PERMISSIONS.ADMINS_ACCESS,
      },
    ],
  },
];

import { Archive, Home, UserCheck, Users } from "lucide-react";
import { ReactNode } from "react";

export interface SidebarChild {
  label: string;
  href: string;
}

export interface SidebarItem {
  label: string;
  icon: ReactNode;
  href: string;
  children: SidebarChild[];
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Properties",
    icon: <Home size={20} />,
    href: "#",
    children: [
      { label: "View All Properties", href: "/admin/view-all-properties" },
      { label: "Property Verification", href: "/admin/property-verification" },
    ],
  },
  {
    label: "Lead Management",
    icon: <UserCheck size={20} />,
    href: "#",
    children: [
      { label: "Property Lead", href: "/admin/lead-management/property" },
      { label: "Support Lead", href: "/admin/lead-management/support" },
    ],
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    href: "#",
    children: [
      { label: "HouseClay Users", href: "/admin/user-management" },
      { label: "Add new Zebra user", href: "/admin/add-zebra-user" },
    ],
  },
];

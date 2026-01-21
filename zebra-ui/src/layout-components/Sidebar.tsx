"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

import { sidebarItems } from "@/common/constants";
import { AdminRole } from "@/store/adminAuthSlice";
import { RootState } from "@/store/store";
import { toSlug } from "@/utils/core";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );
  const adminRole = useSelector((state: RootState) => state.adminAuth.role);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const hasPermission = (itemRoles?: AdminRole[]) => {
    if (!itemRoles) return true;
    if (!adminRole) return false;
    return itemRoles.includes(adminRole);
  };

  const visibleSidebarItems = sidebarItems
    .filter((item) => hasPermission(item.allowedRoles))
    .map((item) => ({
      ...item,
      children: item.children.filter((child) =>
        hasPermission(child.allowedRoles),
      ),
    }))
    .filter((item) => item.children.length > 0 || !item.children.length);

  return (
    <aside className="bg-gray-300 w-72 lg:w-80 min-h-screen py-20 px-4 flex flex-col gap-2 fixed left-0 top-0 z-40 shadow-lg">
      <div className="flex flex-col gap-2">
        {visibleSidebarItems.map((item) => (
          <div key={item.label}>
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors`}
              onClick={() => item.children.length && toggleSection(item.label)}
              data-testid={`sidebar-section-${toSlug(item.label)}`} // Zebra-UI: test id
            >
              <div className="flex items-center gap-3 text-gray-950">
                {item.icon}
                <Link
                  href={item.href}
                  className="font-medium text-xl font-nunito"
                >
                  {item.label}
                </Link>
              </div>
              {item.children.length ? (
                openSections[item.label] ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )
              ) : null}
            </div>
            {item.children.length && openSections[item.label] && (
              <div className="ml-16 flex flex-col gap-1 font-nunito">
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    data-testid={`sidebar-link-${toSlug(child.label)}`} // Zebra-UI: test id
                    className="py-1 text-lg text-gray-700 hover:text-gray-950 cursor-pointer block"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useSelector } from "react-redux";

import { sidebarItems } from "@/common/constants";
import { AdminRole } from "@/interfaces/AdminAuth";
import { useSidebar } from "@/providers/SidebarContext";
import { RootState } from "@/store/store";
import Popover from "@/utility-components/Popover";
import { toSlug } from "@/utils/core";

// ── Collapsed item with Popover flyout ──
function CollapsedSidebarItem({
  item,
}: {
  item: {
    label: string;
    icon: ReactNode;
    children: { label: string; href: string }[];
  };
}) {
  return (
    <Popover
      id={`sidebar-flyout-${toSlug(item.label)}`}
      trigger="hover"
      placement="right"
      align="start"
      offset={8}
      zIndex={50}
      panelClassName="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
      content={({ close }) => (
        <>
          <div className="px-3 py-2 text-sm font-semibold text-gray-900 font-nunito border-b border-gray-100">
            {item.label}
          </div>
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              data-testid={`sidebar-link-${toSlug(child.label)}`}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 font-nunito transition-colors"
              onClick={close}
            >
              {child.label}
            </Link>
          ))}
        </>
      )}
    >
      <div
        data-testid={`sidebar-section-${toSlug(item.label)}`}
        className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
      >
        <span className="text-gray-950 shrink-0">{item.icon}</span>
      </div>
    </Popover>
  );
}

// ── Main Sidebar ──
const Sidebar = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );
  const adminRole = useSelector((state: RootState) => state.adminAuth.role);
  const { isCollapsed } = useSidebar();

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const hasPermission = (allowedRoles?: AdminRole[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!adminRole) return false;
    return allowedRoles.includes(adminRole);
  };

  const visibleSidebarItems = sidebarItems
    .map((item) => {
      if (!hasPermission(item.allowedRoles)) return null;
      const validChildren = item.children.filter((child) =>
        hasPermission(child.allowedRoles),
      );
      if (item.href === "#" && validChildren.length === 0) return null;
      return { ...item, children: validChildren };
    })
    .filter((item) => item !== null);

  return (
    <aside
      className={`bg-gray-300 min-h-screen pt-20 pb-4 flex flex-col gap-2 fixed left-0 top-0 z-40 shadow-lg overflow-hidden transition-[width,padding] duration-300 ease-in-out ${
        isCollapsed ? "w-16 px-2" : "w-72 lg:w-80 px-4"
      }`}
    >
      <div className="flex flex-col gap-1">
        {visibleSidebarItems.map((item) =>
          isCollapsed ? (
            <CollapsedSidebarItem key={item.label} item={item} />
          ) : (
            <div key={item.label}>
              <div
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors`}
                onClick={() =>
                  item.children.length && toggleSection(item.label)
                }
                data-testid={`sidebar-section-${toSlug(item.label)}`}
              >
                <div className="flex items-center gap-2.5 text-gray-950 overflow-hidden">
                  <span className="shrink-0">{item.icon}</span>
                  <Link
                    href={item.href}
                    className="font-medium text-xl font-nunito whitespace-nowrap"
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
              {item.children.length > 0 && openSections[item.label] && (
                <div className="ml-12 flex flex-col gap-1 font-nunito">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      data-testid={`sidebar-link-${toSlug(child.label)}`}
                      className="py-1 text-base text-gray-700 hover:text-gray-950 hover:bg-gray-200 cursor-pointer block rounded-lg px-2"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

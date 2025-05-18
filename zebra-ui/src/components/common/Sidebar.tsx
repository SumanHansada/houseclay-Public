"use client";

import {
  BookCopy,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Home,
  IndianRupee,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  {
    label: "Properties",
    icon: <Home size={20} />,
    children: [
      {
        label: "Add Rental Property",
        href: "/admin/add-property/rent/property-details",
      },
      {
        label: "Add Sale Property",
        href: "/admin/add-property/resale/property-details",
      },
      { label: "View All Properties", href: "/admin/view-all-properties" },
    ],
    href: "#",
  },
  {
    label: "ClayManage",
    icon: <BookCopy size={20} />,
    children: ["Subitem 1", "Subitem 2"],
    href: "#",
  },
  {
    label: "Lead Management",
    icon: <UserCheck size={20} />,
    children: ["Subitem 1", "Subitem 2"],
    href: "#",
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    children: ["Subitem 1", "Subitem 2"],
    href: "#",
  },
  {
    label: "Payments",
    icon: <CreditCard size={20} />,
    children: ["Subitem 1", "Subitem 2"],
    href: "#",
  },
  {
    label: "Config",
    icon: <Settings size={20} />,
    children: ["Subitem 1", "Subitem 2"],
    href: "#",
  },
  {
    label: "Expense Tracker",
    icon: <IndianRupee size={20} />,
    children: ["Subitem 1", "Subitem 2"],
    href: "#",
  },
];

const Sidebar = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="bg-[#232c3d] text-white w-72 lg:w-80 min-h-screen py-20 px-4 flex flex-col gap-2 fixed left-0 top-0 z-40 shadow-lg">
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <div key={item.label}>
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#1a2232] cursor-pointer transition-colors ${item.children.length ? "" : ""}`}
              onClick={() => item.children.length && toggleSection(item.label)}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <Link
                  href={item.href}
                  className="font-medium text-base font-nunito"
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
                {item.children.map((child) =>
                  typeof child === "string" ? (
                    <div
                      key={child}
                      className="py-1 text-base text-gray-300 hover:text-white cursor-pointer"
                    >
                      {child}
                    </div>
                  ) : (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="py-1 text-base text-gray-300 hover:text-white cursor-pointer block"
                    >
                      {child.label}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

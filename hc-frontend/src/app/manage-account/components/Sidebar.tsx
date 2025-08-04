// app/manage-account/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── 1. Import each SVG once ───────────────────────────────────────────────
import ProfileIcon from "public/icons/my-profile.svg";
import RequirementsIcon from "public/icons/my-requirements.svg";
import ShortlistsIcon from "public/icons/shortlists.svg";
import ConnectsIcon from "public/icons/connects.svg";
import PaymentsIcon from "public/icons/my-payments.svg";
import PropertiesIcon from "public/icons/my-properties.svg";
import OwnersIcon from "public/icons/owners-contacted.svg";
import SupportIcon from "public/icons/support.svg";
import LogoutIcon from "public/icons/logout.svg";

import ChevronRightIcon from "public/icons/black-chevron-right.svg";

interface NavItem {
  label: string;
  href: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  {
    label: "My Profile",
    href: "/manage-account/my-profile",
    Icon: ProfileIcon,
  },
  {
    label: "My Requirements",
    href: "/manage-account/my-requirements",
    Icon: RequirementsIcon,
  },
  {
    label: "Shortlists",
    href: "/manage-account/shortlists",
    Icon: ShortlistsIcon,
  },
  { label: "Connects", href: "/manage-account/connects", Icon: ConnectsIcon },
  {
    label: "My Payments",
    href: "/manage-account/my-payments",
    Icon: PaymentsIcon,
  },
  {
    label: "My Properties",
    href: "/manage-account/my-properties",
    Icon: PropertiesIcon,
  },
  {
    label: "Owners You Contacted",
    href: "/manage-account/owners-you-contacted",
    Icon: OwnersIcon,
  },
  { label: "Support", href: "/manage-account/support", Icon: SupportIcon },
  { label: "Logout", href: "/manage-account/logout", Icon: LogoutIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white">
      <nav className="space-y-1 bg-gray-50 rounded-lg p-4">
        {navItems.map(({ label, href, Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/manage-account" && pathname.startsWith(href));

          // active items get red text; others stay gray
          const textColor = isActive ? "text-red-500" : "text-gray-700";

          return (
            <Link key={href} href={href}>
              {/* wrapper for icon + text+chevron */}
              <div className="flex items-center gap-3 px-5 py-3">
                {/* icon inherits the same textColor */}
                <Icon className={`w-5 h-5 ${textColor}`} />

                {/* label + chevron share a flex container */}
                <div
                  className={
                    `flex-1 flex items-center justify-between ` +
                    (isActive
                      ? "border-b-2 border-red-500 pb-2" // underline + padding
                      : "")
                  }
                >
                  <span className={`font-medium ${textColor}`}>{label}</span>
                  <ChevronRightIcon className={`w-4 h-4 ${textColor}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import ProfileIcon from "public/icons/my-profile.svg";
// import RequirementsIcon from "public/icons/my-requirements.svg";
// import ShortlistsIcon from "public/icons/shortlists.svg";
// import ConnectsIcon from "public/icons/connects.svg";
// import PaymentsIcon from "public/icons/my-payments.svg";
// import PropertiesIcon from "public/icons/my-properties.svg";
// import OwnersIcon from "public/icons/owners-contacted.svg";
// import SupportIcon from "public/icons/support.svg";
// import LogoutIcon from "public/icons/logout.svg";

// import ChevronRightIcon from "public/icons/black-chevron-right.svg";

// type NavItem = {
//   label: string;
//   href: string;
//   Icon: React.FC<React.SVGProps<SVGSVGElement>>;
// };

// const navItems: NavItem[] = [
//   {
//     label: "My Profile",
//     href: "/manage-account/my-profile",
//     Icon: ProfileIcon,
//   },
//   {
//     label: "My Requirements",
//     href: "/manage-account/my-requirements",
//     Icon: RequirementsIcon,
//   },
//   {
//     label: "Shortlists",
//     href: "/manage-account/shortlists",
//     Icon: ShortlistsIcon,
//   },
//   { label: "Connects", href: "/manage-account/connects", Icon: ConnectsIcon },
//   {
//     label: "My Payments",
//     href: "/manage-account/my-payments",
//     Icon: PaymentsIcon,
//   },
//   {
//     label: "My Properties",
//     href: "/manage-account/my-properties",
//     Icon: PropertiesIcon,
//   },
//   {
//     label: "Owners You Contacted",
//     href: "/manage-account/owners-you-contacted",
//     Icon: OwnersIcon,
//   },
//   { label: "Support", href: "/manage-account/support", Icon: SupportIcon },
//   { label: "Logout", href: "/manage-account/logout", Icon: LogoutIcon },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="w-96 bg-white">
//       <nav className="space-y-1 bg-gray-50 rounded-lg">
//         {navItems.map(({ label, href, Icon }) => {
//           const isActive =
//             pathname === href ||
//             (href !== "/manage-account" && pathname.startsWith(href));

//           const textColor = isActive ? "text-red-500" : "text-gray-700";
//           const bgColor = isActive ? "bg-red-50" : "hover:bg-gray-100";

//           return (
//             <Link
//               key={href}
//               href={href}
//               className={`flex items-center px-5 py-2 gap-2 ${textColor}`}
//             >
//               <Icon className={textColor} />
//               <div
//                 className={`flex item-center justify-between flex-1 ${isActive ? "border-b border-red-500 border-spacing-y-4" : ""}`}
//               >
//                 <span className="font-medium">{label}</span>
//                 <ChevronRightIcon />
//               </div>
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

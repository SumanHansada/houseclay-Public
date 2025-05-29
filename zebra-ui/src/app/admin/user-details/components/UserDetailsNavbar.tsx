"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type Tab = {
  label: string;
  slug: string;
};

const tabs: Tab[] = [
  { label: "Profile", slug: "profile" },
  { label: "Listed Properties", slug: "listed-properties" },
  { label: "Connect History", slug: "connect-history" },
  { label: "Payment History", slug: "payment-history" },
  { label: "Shortlisted Properties", slug: "shortlisted-properties" },
  { label: "Contacted Properties", slug: "contacted-properties" },
  { label: "Viewed Properties*", slug: "viewed-properties" },
];

export const UserDetailsNavbar: React.FC = () => {
  const params = useParams();
  const pathname = usePathname();
  const id = params?.id;

  return (
    <ul className="flex gap-5 py-3 text-lg">
      {tabs.map(({ label, slug }) => {
        const href = `/admin/user-details/${id}/${slug}`;
        const isActive = pathname === href;
        return (
          <li key={slug}>
            <Link
              href={href}
              className={`px-2 py-1 block hover:text-red-200 transition-colors
                ${isActive ? "underline text-red-400" : ""}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

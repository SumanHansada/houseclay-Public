"use client";

import { default as RequirementsIcon } from "public/optimizedIcons/medium/my-requirements.svg";
import { default as OwnersIcon } from "public/optimizedIcons/medium/owners-contacted.svg";
import { default as ConnectsIcon } from "public/optimizedIcons/small/connects.svg";
import { default as LogoutIcon } from "public/optimizedIcons/small/logout.svg";
import { default as PaymentsIcon } from "public/optimizedIcons/small/my-payments.svg";
import { default as ProfileIcon } from "public/optimizedIcons/small/my-profile.svg";
import { default as PropertiesIcon } from "public/optimizedIcons/small/my-properties.svg";
import { default as ShortlistsIcon } from "public/optimizedIcons/small/shortlists.svg";
import { default as SupportIcon } from "public/optimizedIcons/small/support.svg";
import type { FC, SVGProps } from "react";

export type NavIconType = FC<SVGProps<SVGSVGElement>>;
export type NavActionId = "LOGOUT";

export interface AccountNavItem {
  label: string;
  href: string;
  NavIcon: NavIconType;
  actionId?: NavActionId;
}

export const ACCOUNT_NAV: AccountNavItem[] = [
  {
    label: "My Profile",
    href: "/manage-account/my-profile",
    NavIcon: ProfileIcon,
  },
  {
    label: "My Requirements",
    href: "/manage-account/my-requirements",
    NavIcon: RequirementsIcon,
  },
  {
    label: "Shortlists",
    href: "/manage-account/shortlists",
    NavIcon: ShortlistsIcon,
  },
  {
    label: "Connects",
    href: "/manage-account/connects",
    NavIcon: ConnectsIcon,
  },
  {
    label: "My Payments",
    href: "/manage-account/my-payments",
    NavIcon: PaymentsIcon,
  },
  {
    label: "My Properties",
    href: "/manage-account/my-properties",
    NavIcon: PropertiesIcon,
  },
  {
    label: "Owners You Contacted",
    href: "/manage-account/owners-you-contacted",
    NavIcon: OwnersIcon,
  },
  {
    label: "Support",
    href: "/manage-account/support",
    NavIcon: SupportIcon,
  },
  {
    label: "Logout",
    href: "/",
    NavIcon: LogoutIcon,
    actionId: "LOGOUT",
  },
];

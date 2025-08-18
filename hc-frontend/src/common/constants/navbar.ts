"use client";

import type { FC, SVGProps } from "react";

import ProfileIcon from "public/icons/my-profile.svg";
import RequirementsIcon from "public/icons/my-requirements.svg";
import ShortlistsIcon from "public/icons/shortlists.svg";
import ConnectsIcon from "public/icons/connects.svg";
import PaymentsIcon from "public/icons/my-payments.svg";
import PropertiesIcon from "public/icons/my-properties.svg";
import OwnersIcon from "public/icons/owners-contacted.svg";
import SupportIcon from "public/icons/support.svg";
import LogoutIcon from "public/icons/logout.svg";

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

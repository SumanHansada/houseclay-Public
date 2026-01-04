"use client";

import { Heart, Search, UserRound } from "lucide-react";
// import { default as RequirementsIcon } from "public/optimizedIcons/medium/my-requirements.svg";
import { default as OwnersIcon } from "public/optimizedIcons/medium/owners-contacted.svg";
import { default as ConnectsIcon } from "public/optimizedIcons/small/connects.svg";
import { default as LogoutIcon } from "public/optimizedIcons/small/logout.svg";
import { default as PaymentsIcon } from "public/optimizedIcons/small/my-payments.svg";
import { default as ProfileIcon } from "public/optimizedIcons/small/my-profile.svg";
import { default as PropertiesIcon } from "public/optimizedIcons/small/my-properties.svg";
import { default as ShortlistsIcon } from "public/optimizedIcons/small/shortlists.svg";
import { default as SupportIcon } from "public/optimizedIcons/small/support.svg";
import React, { type FC, type SVGProps } from "react";

import { SvgIcon } from "@/utility-components";

type NavIconType = FC<SVGProps<SVGSVGElement>>;
type NavActionId = "LOGOUT";

export interface AccountNavItem {
  label: string;
  headerLabel: string;
  href: string;
  NavIcon: NavIconType;
  actionId?: NavActionId;
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  {
    label: "My Profile",
    headerLabel: "My Profile",
    href: "/manage-account/my-profile",
    NavIcon: ProfileIcon,
  },
  // Removed my-requirements
  // {
  //   label: "My Requirements",
  //   headerLabel: "My Requirements",
  //   href: "/manage-account/my-requirements",
  //   NavIcon: RequirementsIcon,
  // },
  {
    label: "Shortlists",
    headerLabel: "Shortlisted Properties",
    href: "/manage-account/shortlists",
    NavIcon: ShortlistsIcon,
  },
  {
    label: "Connects",
    headerLabel: "Connects",
    href: "/manage-account/connects",
    NavIcon: ConnectsIcon,
  },
  {
    label: "My Payments",
    headerLabel: "Your Payments",
    href: "/manage-account/my-payments",
    NavIcon: PaymentsIcon,
  },
  {
    label: "My Properties",
    headerLabel: "My Properties",
    href: "/manage-account/my-properties",
    NavIcon: PropertiesIcon,
  },
  {
    label: "Owners You Contacted",
    headerLabel: "Properties Contacted",
    href: "/manage-account/owners-you-contacted",
    NavIcon: OwnersIcon,
  },
  {
    label: "Support",
    headerLabel: "Support",
    href: "/manage-account/support",
    NavIcon: SupportIcon,
  },
  {
    label: "Logout",
    headerLabel: "Logout",
    href: "/",
    NavIcon: LogoutIcon,
    actionId: "LOGOUT",
  },
];

export type StickyNavItem = {
  id: string;
  icon: React.ReactElement;
  label: string;
  href: string;
  badge?: boolean;
};

export const STICKY_NAV_ITEMS: StickyNavItem[] = [
  {
    id: "explore",
    icon: React.createElement(Search, { size: 25 }),
    label: "Explore",
    href: `/property-search?city=bengaluru&propertyCategory=rent`,
  },
  {
    id: "shortlists",
    icon: React.createElement(Heart, { size: 25 }),
    label: "Shortlists",
    href: "/manage-account/shortlists",
  },
  {
    id: "home",
    icon: React.createElement(SvgIcon, {
      iconSize: "small",
      name: "houseclay-home",
      size: 25,
    }),
    label: "Home",
    href: "/",
  },
  {
    id: "connects",
    icon: React.createElement(SvgIcon, {
      iconSize: "medium",
      name: "connects",
      size: 25,
    }),
    label: "Connects",
    href: "/manage-account/connects",
    badge: true,
  },
  {
    id: "account",
    icon: React.createElement(UserRound, { width: 25, height: 25 }),
    label: "Account",
    href: "/manage-account/my-profile",
  },
];

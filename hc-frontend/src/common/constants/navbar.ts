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

import ProfileIconActive from "public/icons/my-profile-red.svg";
// TODO: replace with red variant when available
import RequirementsIconActive from "public/icons/my-requirements.svg";
import ShortlistsIconActive from "public/icons/shortlists-red.svg";
import ConnectsIconActive from "public/icons/connects-red.svg";
import PaymentsIconActive from "public/icons/my-payments-red.svg";
import PropertiesIconActive from "public/icons/my-properties-red.svg";
import OwnersIconActive from "public/icons/owners-contacted-red.svg";
import SupportIconActive from "public/icons/support-red.svg";

export type NavIcon = FC<SVGProps<SVGSVGElement>>;
export type NavKind = "route" | "action";

type Base = {
  kind: NavKind;
  label: string;
  Icon: NavIcon;
  ActiveIcon?: NavIcon;
};

type RouteItem = Base & {
  kind: "route";
  href: string;
};

type ActionItem = Base & {
  kind: "action";
  actionId: "logout";
};

export type AccountNavItem = RouteItem | ActionItem;

export const ACCOUNT_NAV: AccountNavItem[] = [
  {
    kind: "route",
    label: "My Profile",
    href: "/manage-account/my-profile",
    Icon: ProfileIcon,
    ActiveIcon: ProfileIconActive,
  },
  {
    kind: "route",
    label: "My Requirements",
    href: "/manage-account/my-requirements",
    Icon: RequirementsIcon,
    ActiveIcon: RequirementsIconActive,
  },
  {
    kind: "route",
    label: "Shortlists",
    href: "/manage-account/shortlists",
    Icon: ShortlistsIcon,
    ActiveIcon: ShortlistsIconActive,
  },
  {
    kind: "route",
    label: "Connects",
    href: "/manage-account/connects",
    Icon: ConnectsIcon,
    ActiveIcon: ConnectsIconActive,
  },
  {
    kind: "route",
    label: "My Payments",
    href: "/manage-account/my-payments",
    Icon: PaymentsIcon,
    ActiveIcon: PaymentsIconActive,
  },
  {
    kind: "route",
    label: "My Properties",
    href: "/manage-account/my-properties",
    Icon: PropertiesIcon,
    ActiveIcon: PropertiesIconActive,
  },
  {
    kind: "route",
    label: "Owners You Contacted",
    href: "/manage-account/owners-you-contacted",
    Icon: OwnersIcon,
    ActiveIcon: OwnersIconActive,
  },
  {
    kind: "route",
    label: "Support",
    href: "/manage-account/support",
    Icon: SupportIcon,
    ActiveIcon: SupportIconActive,
  },
  { kind: "action", label: "Logout", actionId: "logout", Icon: LogoutIcon },
];

export const ACCOUNT_NAV_OPTIONS = ACCOUNT_NAV.map((i) =>
  i.kind === "route"
    ? { id: i.href, label: i.label }
    : { id: `action:${i.actionId}`, label: i.label },
);

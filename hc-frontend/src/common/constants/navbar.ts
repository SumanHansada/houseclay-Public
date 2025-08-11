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
export type NavKind = "route" | "action";

type Base = {
  kind: NavKind;
  label: string;
  NavIcon: NavIconType;
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
    NavIcon: ProfileIcon,
  },
  {
    kind: "route",
    label: "My Requirements",
    href: "/manage-account/my-requirements",
    NavIcon: RequirementsIcon,
  },
  {
    kind: "route",
    label: "Shortlists",
    href: "/manage-account/shortlists",
    NavIcon: ShortlistsIcon,
  },
  {
    kind: "route",
    label: "Connects",
    href: "/manage-account/connects",
    NavIcon: ConnectsIcon,
  },
  {
    kind: "route",
    label: "My Payments",
    href: "/manage-account/my-payments",
    NavIcon: PaymentsIcon,
  },
  {
    kind: "route",
    label: "My Properties",
    href: "/manage-account/my-properties",
    NavIcon: PropertiesIcon,
  },
  {
    kind: "route",
    label: "Owners You Contacted",
    href: "/manage-account/owners-you-contacted",
    NavIcon: OwnersIcon,
  },
  {
    kind: "route",
    label: "Support",
    href: "/manage-account/support",
    NavIcon: SupportIcon,
  },
  { kind: "action", label: "Logout", actionId: "logout", NavIcon: LogoutIcon },
];

export const ACCOUNT_NAV_OPTIONS = ACCOUNT_NAV.map((i) =>
  i.kind === "route"
    ? { id: i.href, label: i.label }
    : { id: `action:${i.actionId}`, label: i.label },
);

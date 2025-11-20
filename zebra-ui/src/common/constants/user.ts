import { UserDetailsTabEnum } from "@/common/enums";

/** Authoritative labels for each tab value (used by UI & tests). */
export const userDetailsTabLabels: Record<UserDetailsTabEnum, string> = {
  [UserDetailsTabEnum.PROFILE]: "Profile",
  [UserDetailsTabEnum.OWNED]: "Owned Properties",
  [UserDetailsTabEnum.SHORTLISTED]: "Shortlisted",
  // [UserDetailsTabEnum.CONNECT]: "Connect History",
  [UserDetailsTabEnum.PAYMENT]: "Payment History",
  [UserDetailsTabEnum.CONTACTED]: "Contacted",
  [UserDetailsTabEnum.VIEWED]: "Viewed",
  [UserDetailsTabEnum.REPORT]: "Reported",
};

/** Convenience array if the UI prefers array iteration. */
export const userDetailsTabs = Object.entries(userDetailsTabLabels).map(
  ([value, label]) => ({ value: value as UserDetailsTabEnum, label }),
);

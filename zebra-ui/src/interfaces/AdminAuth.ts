export const ADMIN_ROLES = {
  CAPTAIN: "CAPTAIN",
  MANAGER: "MANAGER",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  CAPTAIN: "Captain",
  MANAGER: "Manager",
  SUPER_ADMIN: "Super Admin",
};

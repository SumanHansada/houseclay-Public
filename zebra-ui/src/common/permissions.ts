import { ADMIN_ROLES } from "@/interfaces/AdminAuth";

// Define the roles for clarity
const { SUPER_ADMIN, MANAGER, CAPTAIN } = ADMIN_ROLES;

// Define permission sets (The "Single Source of Truth")
export const PERMISSIONS = {
  // Public-ish admin routes
  ALL_ADMINS: [SUPER_ADMIN, MANAGER, CAPTAIN],

  // Specific modules
  PROPERTIES_ACCESS: [SUPER_ADMIN, MANAGER, CAPTAIN],
  LEADS_ACCESS: [SUPER_ADMIN, MANAGER, CAPTAIN],
  USERS_ACCESS: [SUPER_ADMIN, MANAGER, CAPTAIN],

  // Restricted modules
  ADMINS_ACCESS: [SUPER_ADMIN],
  ADD_CONNECTS: [SUPER_ADMIN],
};

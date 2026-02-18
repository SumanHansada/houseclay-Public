import { ADMIN_ROLES } from "@/interfaces/AdminAuth";

// Define the roles for clarity
const { SUPER_ADMIN, MANAGER, CAPTAIN } = ADMIN_ROLES;

// Define permission sets (The "Single Source of Truth")
export const PERMISSIONS = {
  // Public-ish admin routes
  ALL_ADMINS: [SUPER_ADMIN, MANAGER, CAPTAIN],

  // Specific modules
  PROPERTY_MANAGEMENT: [SUPER_ADMIN, MANAGER, CAPTAIN],
  LEADS_ACCESS: [SUPER_ADMIN, MANAGER, CAPTAIN],
  USER_MANAGEMENT: [SUPER_ADMIN, MANAGER, CAPTAIN],

  // Restricted modules
  ADMIN_MANAGEMENT: [SUPER_ADMIN],
  ADD_CONNECTS: [SUPER_ADMIN],
};

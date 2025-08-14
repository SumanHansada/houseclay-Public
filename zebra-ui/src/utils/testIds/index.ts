// Act as a barrel file, exporting the factories
export { default as createTestIdFactory } from "./base";
export { default as createTabbedTestIdFactory } from "./tabs";

// Act as a util file, creating and exporting feature-specific helpers
import { userDetailsTabLabels } from "@/common/constants/user";
import { UserDetailsTabEnum } from "@/common/enums";

import createTabbedTestIdFactory from "./tabs";

// Create and export the complete test ID helper object for the user details feature.
export const userDetailsTestIds = createTabbedTestIdFactory({
  featureName: "user-details",
  enumObject: UserDetailsTabEnum,
  labelMap: userDetailsTabLabels,
});

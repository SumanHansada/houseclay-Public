import { DialogLabelConfig } from "@/interfaces/Dialog";

export type DialogKey =
  | "blacklist"
  | "activate"
  | "tagBroker"
  | "verify"
  | "deactivate";

export const dialogLabels: Record<DialogKey, DialogLabelConfig> = {
  blacklist: {
    title: "Blacklist User",
    prompt: "Are you sure you want to blacklist this user?",
    confirmLabel: "Blacklist",
    colour: "red",
    requireComment: true,
  },
  activate: {
    title: "Activate User",
    prompt: "Are you sure you want to activate this user?",
    confirmLabel: "Activate",
    colour: "green",
    requireComment: true,
  },
  tagBroker: {
    title: "Tag Owner as Broker",
    prompt: "Add a remark for the owner’s broker tag.",
    confirmLabel: "Tag Owner",
    colour: "red",
    requireComment: true,
  },
  verify: {
    title: "Verify Property",
    prompt: "Mark this property as VERIFIED?",
    confirmLabel: "Verify",
    colour: "green",
  },
  deactivate: {
    title: "Deactivate Property",
    prompt: "Deactivate this property listing?",
    confirmLabel: "Deactivate",
    colour: "red",
  },
};

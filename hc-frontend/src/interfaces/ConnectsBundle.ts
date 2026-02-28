export type ConnectBundleID =
  | "BASIC_BLUE_BUNDLE"
  | "PREMIUM_GOLD_BUNDLE"
  | "ELITE_PURPLE_BUNDLE"
  | "CUSTOM_CONNECTS";

export interface ConnectsBundle {
  id: string;
  title: string;
  subTitle: string;
  connects: number;
  standardPrice: number;
}

export interface DialogLabelConfig {
  title: string;
  prompt: string;
  confirmLabel: string;
  colour: "red" | "green" | "gray";
  /** Show textarea & require ≥ 3 chars? */
  requireComment?: boolean;
}

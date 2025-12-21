export type OptionValue = string | number | boolean;

export interface BaseOption<T extends OptionValue = string> {
  value: T;
  label: string;
}

export interface PriceOption {
  value: string;
  label: string;
  min: number;
  max: number;
}

export interface NumericOptionConfig {
  min?: number;
  max: number;
  addZeroOption?: boolean;
  zeroOptionLabel?: string;
  prefix?: string;
  suffix?: string;
}

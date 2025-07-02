type StringEnum = Record<string, string>;

interface EnsureEnumValueParams<E extends StringEnum> {
  enumObj: E;
  value: unknown;
  fallback: E[keyof E];
}

/** Narrowly test that an arbitrary value is a member of a string enum. */
export function isEnumValue<E extends StringEnum>(
  enumObj: E,
  value: unknown,
): value is E[keyof E] {
  return Object.values(enumObj).includes(value as string);
}

/**
 * Returns `value` if it’s in the enum, otherwise `fallback`.
 *   const tab = ensureEnumValue(UserTabEnum, currentTabFromUrl, UserTabEnum.PROFILE);
 */
export function ensureEnumValue<E extends StringEnum>({
  enumObj,
  value,
  fallback,
}: EnsureEnumValueParams<E>): E[keyof E] {
  return isEnumValue(enumObj, value) ? value : fallback;
}

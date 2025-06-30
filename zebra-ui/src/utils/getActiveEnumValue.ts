/**
 * Returns `candidate` if it exists in the enum, otherwise `fallback`.
 *
 * Example:
 *   const tab = getActiveEnumValue(UserTabEnum, candidate, UserTabEnum.PROFILE);
 */

export function getActiveEnumValue<E extends Record<string, string>>(
  enumObj: E,
  candidate: string | undefined | null,
  fallback: E[keyof E],
): E[keyof E] {
  return (Object.values(enumObj) as string[]).includes(candidate ?? "")
    ? (candidate as E[keyof E])
    : fallback;
}

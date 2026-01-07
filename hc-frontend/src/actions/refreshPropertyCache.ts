"use server";

import { revalidateTag } from "next/cache";

export async function refreshPropertyCache(propertyID: string) {
  // This instantly marks the cache for this property as "stale"
  revalidateTag(`property-${propertyID}`);
}

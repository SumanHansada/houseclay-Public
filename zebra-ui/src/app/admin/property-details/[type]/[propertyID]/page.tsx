import { redirect } from "next/navigation";
import { use } from "react";

import { PropertyDetailsTabEnum } from "@/common/enum";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ propertyID: string; type: string }>;
}

export default function PropertyDetailsRedirectPage({ params }: TParams) {
  const { propertyID, type } = use(params);
  redirect(
    `/admin/property-details/${type}/${propertyID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
}

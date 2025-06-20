import { redirect } from "next/navigation";
import { use } from "react";

import { PropertyDetailsTabEnum } from "@/common/enums";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ propertyID: string; type: string }>;
}

export default function UserDetailsRedirectPage({ params }: TParams) {
  const { propertyID, type } = use(params);
  console.log(
    `/admin/property-details/${type}/${propertyID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
  redirect(
    `/admin/property-details/${type}/${propertyID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
}

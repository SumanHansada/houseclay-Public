import { redirect } from "next/navigation";
import { use } from "react";

import { ReverifyPropertyTabEnum } from "@/common/enum";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ propertyID: string; type: string }>;
}

export default function VerifyPropertyRedirectPage({ params }: TParams) {
  const { propertyID, type } = use(params);
  redirect(
    `/admin/property-details/${type}/reverify/${propertyID}/${ReverifyPropertyTabEnum.DETAILS}`,
  );
}

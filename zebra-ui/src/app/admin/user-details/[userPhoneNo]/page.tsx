import { redirect } from "next/navigation";
import { use } from "react";

import { UserDetailsTabEnum } from "@/common/enums";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ userPhoneNo: string }>;
}

export default function UserDetailsRedirectPage({ params }: TParams) {
  const { userPhoneNo } = use(params);
  redirect(`/admin/user-details/${userPhoneNo}/${UserDetailsTabEnum.PROFILE}`);
}

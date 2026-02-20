import { redirect } from "next/navigation";

import { UserDetailsTabEnum } from "@/common/enums";
import { safeUrlDecode } from "@/utils/core";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export default async function UserDetailsRedirectPage({ params }: PageProps) {
  const { phoneNo } = await params;
  const decodedPhone = safeUrlDecode(phoneNo);

  redirect(`/admin/users/${decodedPhone}/${UserDetailsTabEnum.PROFILE}`);
}

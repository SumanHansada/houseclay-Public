import { redirect } from "next/navigation";

import { UserDetailsTabEnum } from "@/common/enums";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ phoneNo: string }>;
}

export default async function UserDetailsRedirectPage({ params }: PageProps) {
  const { phoneNo } = await params;

  redirect(`/admin/users/${phoneNo}/${UserDetailsTabEnum.PROFILE}`);
}

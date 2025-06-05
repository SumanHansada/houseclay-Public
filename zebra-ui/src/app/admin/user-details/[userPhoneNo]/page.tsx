import { redirect } from "next/navigation";
import { use } from "react";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ userPhoneNo: string }>;
}

export default function UserDetailsRedirectPage({ params }: TParams) {
  const { userPhoneNo } = use(params);
  redirect(`/admin/user-details/${userPhoneNo}/profile`);
}

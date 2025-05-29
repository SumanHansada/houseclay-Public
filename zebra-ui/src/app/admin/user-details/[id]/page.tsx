"use client";

import { redirect, useParams } from "next/navigation";

export const dynamicParams = true;

export default function UserDetailsRedirectPage() {
  const params = useParams();
  const id = params?.id as string;
  redirect(`/admin/user-details/${id}/profile`);
}

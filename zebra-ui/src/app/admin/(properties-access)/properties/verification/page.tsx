import { redirect } from "next/navigation";

import { VerifyPropertyStatusEnum } from "@/common/enums";

export default async function PropertyVerificationRedirectPage() {
  redirect(`/admin/properties/verification/${VerifyPropertyStatusEnum.VERIFY}`);
}

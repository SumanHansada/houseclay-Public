import React from "react";
import { redirect } from "next/navigation";

import { VerifyPropertyStatusEnum } from "@/common/enums";

const PropertyVerificationRedirectPage: React.FC = () => {
  redirect(`/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`);
};

export default PropertyVerificationRedirectPage;

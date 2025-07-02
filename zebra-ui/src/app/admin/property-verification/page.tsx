import { redirect } from "next/navigation";
import React from "react";

import { VerifyPropertyStatusEnum } from "@/common/enum";

const PropertyVerificationRedirectPage: React.FC = () => {
  redirect(`/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`);
};

export default PropertyVerificationRedirectPage;

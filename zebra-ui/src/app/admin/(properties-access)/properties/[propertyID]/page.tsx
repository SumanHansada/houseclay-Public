import { redirect } from "next/navigation";

import { PropertyDetailsTabEnum } from "@/common/enums";

interface PageProps {
  params: Promise<{ propertyID: string }>;
}

export default async function PropertiesRedirectPage({ params }: PageProps) {
  const { propertyID } = await params;

  const validPropertyID = (propertyID ?? "").trim();

  if (!validPropertyID) {
    redirect("/admin/dashboard");
  }

  redirect(
    `/admin/properties/${validPropertyID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
}

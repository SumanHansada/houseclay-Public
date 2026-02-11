import { redirect } from "next/navigation";

import { PropertyCategory, PropertyDetailsTabEnum } from "@/common/enums";

type Params = { propertyCategory: string; propertyID: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { propertyID, propertyCategory } = await params;

  const paramID = (propertyID ?? "").trim();
  const paramCategory = (propertyCategory ?? "").trim().toUpperCase();

  const validCategory = (Object.values(PropertyCategory) as string[]).find(
    (val) => val.toUpperCase() === paramCategory,
  );

  if (!paramID || !validCategory || validCategory === PropertyCategory.NONE) {
    redirect("/admin/dashboard");
  }

  redirect(
    `/admin/property-details/${validCategory}/${paramID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
}

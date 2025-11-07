import { redirect } from "next/navigation";
import { PropertyCategory, PropertyDetailsTabEnum } from "@/common/enums";

type Params = { propertyCategory: string; propertyID: string };

export default function Page({ params }: { params: Params }) {
  const paramID = (params.propertyID ?? "").trim();
  const paramCategory = (params.propertyCategory ?? "").trim().toUpperCase();

  const propertyCategory =
    (Object.values(PropertyCategory) as PropertyCategory[]).find(
      (val) => val.toUpperCase() === paramCategory,
    ) ?? null;

  if (
    !paramID ||
    propertyCategory === null ||
    propertyCategory === PropertyCategory.NONE
  ) {
    redirect("/admin/dashboard");
  }

  redirect(
    `/admin/property-details/${propertyCategory}/${paramID}/${PropertyDetailsTabEnum.DETAILS}`,
  );
}

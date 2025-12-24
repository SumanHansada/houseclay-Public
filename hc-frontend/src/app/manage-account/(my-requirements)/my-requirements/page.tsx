"use client";

import { useFormikContext } from "formik";
import { useEffect } from "react";

import { useEditMode } from "@/hooks/useEditMode";
import { MyRequirementsFormValues } from "@/interfaces/ManageAccount";

import { DesktopClient } from "./DesktopClient";
import { MobileClient } from "./MobileClient";
import { rentBudgetOptions, resaleBudgetOptions } from "./options";

export function AutoNormalizeFields() {
  const { values, setFieldValue } =
    useFormikContext<MyRequirementsFormValues>();
  const isTenant = values.userType === "tenant";
  const userTypeUnset = values.userType === "";

  useEffect(() => {
    if (userTypeUnset) return;
    const allowed = isTenant ? rentBudgetOptions : resaleBudgetOptions;
    if (!allowed.some((o) => o.value === values.budget)) {
      setFieldValue("budget", allowed[0]?.value ?? "");
    }
  }, [userTypeUnset, isTenant, values.budget, setFieldValue]);

  useEffect(() => {
    if (userTypeUnset) return;
    if (!isTenant && values.lookingForARoom)
      setFieldValue("lookingForARoom", "");
    if (isTenant && !values.lookingForARoom)
      setFieldValue("lookingForARoom", "yes");
  }, [userTypeUnset, isTenant, values.lookingForARoom, setFieldValue]);

  useEffect(() => {
    if (userTypeUnset) return;
    const isFlatmate = isTenant && values.lookingForARoom === "yes";
    if (isFlatmate && !values.preferredTenants)
      setFieldValue("preferredTenants", "female");
    if (!isFlatmate && values.preferredTenants)
      setFieldValue("preferredTenants", "");
  }, [
    userTypeUnset,
    isTenant,
    values.lookingForARoom,
    values.preferredTenants,
    setFieldValue,
  ]);

  return null;
}

export default function MyRequirementsPage() {
  const { editMode, setEditMode } = useEditMode();

  return (
    <>
      <AutoNormalizeFields />
      {/* Desktop */}
      <section className="max-md:hidden">
        <DesktopClient editMode={editMode} setEditMode={setEditMode} />
      </section>

      {/* Mobile - Layout handles header/footer, we just render content */}
      <section className="md:hidden">
        <MobileClient editMode={editMode} />
      </section>
    </>
  );
}

"use client";

import { Formik, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import { MyRequirementsFormValues } from "@/interfaces/ManageAccount";
import { setHideStickyNavBar } from "@/store/appSlice";

import { DesktopClient } from "./DesktopClient";
import { MobileClient } from "./MobileClient";
import { rentBudgetOptions, resaleBudgetOptions } from "./options";

const DEFAULT_VALUES: MyRequirementsFormValues = {
  userType: "tenant",
  locations: [],
  locationSearch: "",
  propertyType: ["Apartment"],
  bhkType: "1BHK",
  lookingForARoom: "yes",
  preferredTenants: "female",
  budget: "under50K",
};

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

const validationSchema = Yup.object({});

export default function MyRequirementsPage() {
  const [editMode, setEditMode] = useState(false);
  const [savedValues, setSavedValues] =
    useState<MyRequirementsFormValues>(DEFAULT_VALUES);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    return () => {
      dispatch(setHideStickyNavBar(false));
    };
  }, [dispatch]);

  return (
    <Formik<MyRequirementsFormValues>
      initialValues={savedValues}
      enableReinitialize
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values, helpers) => {
        console.log("Submit all data:", values);
        setSavedValues(values);
        setEditMode(false);
        helpers.setSubmitting(false);
      }}
    >
      {() => (
        <>
          <AutoNormalizeFields />
          {/* Desktop */}
          <section className="max-md:hidden">
            <DesktopClient
              editMode={editMode}
              setEditMode={setEditMode}
              savedValues={savedValues}
              DEFAULT_VALUES={DEFAULT_VALUES}
            />
          </section>

          {/* Mobile */}
          <section className="md:hidden">
            <MobileClient
              editMode={editMode}
              setEditMode={setEditMode}
              onBack={() => router.back()}
              savedValues={savedValues}
              DEFAULT_VALUES={DEFAULT_VALUES}
            />
          </section>
        </>
      )}
    </Formik>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideStickyNavBar } from "@/store/appSlice";

import { DesktopClient } from "./DesktopClient";
import { MobileClient } from "./MobileClient";
import FemaleIconSvg from "public/icons/preferred-tenants/female.svg";
import MaleIconSvg from "public/icons/preferred-tenants/male.svg";

const FemaleIcon = FemaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const MaleIcon = MaleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export type UserType = "tenant" | "buyer" | "";
export type Option = { label: string; value: string };
export type IconOption = Option & { icon: React.ReactNode };

export type FormValues = {
  userType: UserType;
  locations: string[];
  locationSearch: string;
  propertyType: string[];
  bhkType: string;
  lookingForARoom: string;
  preferredTenants: string;
  budget: string;
};

export const userTypeOptions: Option[] = [
  { label: "Tenant", value: "tenant" },
  { label: "Buyer", value: "buyer" },
];

export const bhkTypeOptions: Option[] = [
  { label: "1 BHK", value: "1BHK" },
  { label: "2 BHK", value: "2BHK" },
  { label: "3 BHK", value: "3BHK" },
  { label: "4 BHK", value: "4BHK" },
  { label: "5+ BHK", value: "5+BHK" },
];

export const lookingForARoomOptions: Option[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const preferredTenantOptions: IconOption[] = [
  {
    label: "Female",
    value: "female",
    icon: <FemaleIcon />,
  },
  { label: "Male", value: "male", icon: <MaleIcon /> },
];

export const rentBudgetOptions: Option[] = [
  { label: "Under ₹30k", value: "under30K" },
  { label: "Under ₹50K", value: "under50K" },
  { label: "Under ₹80k", value: "under80K" },
  { label: "Flexible", value: "flexible" },
];

export const resaleBudgetOptions: Option[] = [
  { label: "Under ₹1 Cr", value: "under1CR" },
  { label: "Under ₹2 Cr", value: "under2CR" },
  { label: "Under ₹4 Cr", value: "under4CR" },
  { label: "Flexible", value: "flexible" },
];

import Image from "next/image";
import ApartmentIcon from "public/icons/property-types/apartment.webp";
import CommunityVillaIcon from "public/icons/property-types/community-villa.webp";
import IndependentHouseIcon from "public/icons/property-types/independent-house.webp";
import StandaloneBuildingIcon from "public/icons/property-types/standalone-building.webp";

export const propertyTypeOptions: IconOption[] = [
  {
    label: "Apartment",
    value: "Apartment",
    icon: <Image src={ApartmentIcon} alt="Apartment" height={75} width={75} />,
  },
  {
    label: "Independent House/Villa",
    value: "Independent House/Villa",
    icon: (
      <Image
        src={IndependentHouseIcon}
        alt="Independent House/Villa"
        height={75}
        width={75}
      />
    ),
  },
  {
    label: "Community Villa",
    value: "Community Villa",
    icon: (
      <Image
        src={CommunityVillaIcon}
        alt="Community Villa"
        height={75}
        width={75}
      />
    ),
  },
  {
    label: "Standalone Building",
    value: "Standalone Building",
    icon: (
      <Image
        src={StandaloneBuildingIcon}
        alt="Standalone Building"
        height={75}
        width={75}
      />
    ),
  },
];

const DEFAULT_VALUES: FormValues = {
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
  const { values, setFieldValue } = useFormikContext<FormValues>();
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
  const [savedValues, setSavedValues] = useState<FormValues>(DEFAULT_VALUES);
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isMobile) dispatch(setHideStickyNavBar(editMode));
  }, [dispatch, isMobile, editMode]);

  return (
    <Formik<FormValues>
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
          {isMobile ? (
            <MobileClient
              editMode={editMode}
              setEditMode={setEditMode}
              onBack={() => router.back()}
              savedValues={savedValues}
              DEFAULT_VALUES={DEFAULT_VALUES}
            />
          ) : (
            <DesktopClient
              editMode={editMode}
              setEditMode={setEditMode}
              savedValues={savedValues}
              DEFAULT_VALUES={DEFAULT_VALUES}
            />
          )}
        </>
      )}
    </Formik>
  );
}

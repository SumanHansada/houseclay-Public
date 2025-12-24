"use client";

import { Formik } from "formik";
import { ChevronLeft, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";
import * as Yup from "yup";

import { Button } from "@/base-components";
import { useEditMode } from "@/hooks/useEditMode";
import { MyRequirementsFormValues } from "@/interfaces/ManageAccount";
import {
  MobileFooter,
  MobileHeader,
  PageTransition,
} from "@/layout-components";

const validationSchema = Yup.object({});

const DEFAULT_VALUES: MyRequirementsFormValues = {
  userType: "",
  locations: [],
  locationSearch: "",
  propertyType: [],
  bhkType: "",
  lookingForARoom: "",
  preferredTenants: "",
  budget: "",
};

/**
 * Layout for my-requirements route group
 * Handles requirements-specific shared logic and UI structure
 * Wraps children in Formik provider and renders MobileHeader, MobileFooter, and Desktop Footer
 */
export default function MyRequirementsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { editMode, setEditMode } = useEditMode();
  const [savedValues, setSavedValues] =
    useState<MyRequirementsFormValues>(DEFAULT_VALUES);

  const handleBackClick = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      router.back();
    }
  };

  // Create a key based on savedValues to force Formik to reinitialize when savedValues change
  const formKey = useMemo(
    () =>
      `${savedValues.userType}-${savedValues.locations.join(",")}-${savedValues.budget}`,
    [savedValues],
  );

  return (
    <Formik<MyRequirementsFormValues>
      initialValues={savedValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values, helpers) => {
        console.log("Submit all data:", values);
        setSavedValues(values);
        setEditMode(false);
        helpers.setSubmitting(false);
      }}
      key={formKey}
    >
      {({ resetForm, setFieldValue, submitForm }) => {
        const handleCancel = () => {
          resetForm({ values: savedValues });
          setEditMode(false);
        };

        const handleReset = () => {
          resetForm({ values: DEFAULT_VALUES });
        };

        const handleSave = () => {
          setFieldValue("locationSearch", "");
          submitForm();
        };

        return (
          <>
            {/* Desktop: Content + Footer */}
            <section className="w-full overflow-y-auto max-md:hidden">
              <PageTransition
                transitionType="slideRight"
                backTransitionType="slideLeft"
              >
                {children}
                {/* Desktop Footer */}
                {editMode && (
                  <footer className="flex items-center justify-between pt-4 mt-6 text-lg border-t-2 shadow-sm">
                    <button
                      type="button"
                      className="px-5 py-2 border rounded-lg shadow-sm hover:bg-gray-50"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <div className="flex gap-6">
                      <button type="button" className="" onClick={handleReset}>
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2 text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600"
                      >
                        Save
                      </button>
                    </div>
                  </footer>
                )}
              </PageTransition>
            </section>

            {/* Mobile: Header + Content + Footer */}
            <div className="w-full h-full md:hidden">
              <MobileHeader>
                <MobileHeader.LeftAction>
                  <Button
                    variant="secondary"
                    size="custom"
                    className="rounded-full p-1"
                    onClick={handleBackClick}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                </MobileHeader.LeftAction>
                <MobileHeader.Title>My Requirements</MobileHeader.Title>
                {!editMode ? (
                  <MobileHeader.RightAction>
                    <Button
                      variant="secondary"
                      size="custom"
                      className="rounded-full p-1"
                      onClick={() => setEditMode(true)}
                    >
                      <SquarePen size={24} className="p-0.5" />
                    </Button>
                  </MobileHeader.RightAction>
                ) : null}
              </MobileHeader>
              <PageTransition
                transitionType="slideRight"
                backTransitionType="slideLeft"
              >
                {children}
              </PageTransition>
              {editMode && (
                <MobileFooter>
                  <button
                    type="button"
                    className="px-4 py-3 border rounded-xl hover:bg-gray-50"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <div className="flex gap-6">
                    <button type="button" className="" onClick={handleReset}>
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                    >
                      Save
                    </button>
                  </div>
                </MobileFooter>
              )}
            </div>
          </>
        );
      }}
    </Formik>
  );
}

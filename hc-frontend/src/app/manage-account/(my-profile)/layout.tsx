"use client";

import { Formik, FormikHelpers } from "formik";
import { ChevronLeft, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Button } from "@/base-components";
import Spinner from "@/components/Spinner";
import { useEditMode } from "@/hooks/useEditMode";
import { MyProfileFormValues } from "@/interfaces/ManageAccount";
import {
  MobileFooter,
  MobileHeader,
  PageTransition,
} from "@/layout-components";
import { useUpdateUserMutation } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setUserDetail } from "@/store/userSlice";
import { getErrorMessage } from "@/utils/rtkQueryHelpers";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone is required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    )
    .required("Email is required"),
});

/**
 * Layout for my-profile route group
 * Handles profile-specific shared logic and UI structure
 * Wraps children in Formik provider and renders MobileHeader, MobileFooter, and Desktop Footer
 */
export default function MyProfileLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userDetail } = useSelector((state: RootState) => state.user);
  const { editMode, setEditMode } = useEditMode();
  const [profileLoading, setProfileLoading] = useState(false);

  const [updateUser] = useUpdateUserMutation();

  const initialValues: MyProfileFormValues = useMemo(
    () => ({
      name: userDetail.name,
      phoneNumber: userDetail.phoneNo,
      email: userDetail.emailID,
      phoneVerified: true,
      onWhatsapp: userDetail.onWhatsApp,
      emailVerified: userDetail.emailVerified,
    }),
    [userDetail],
  );

  const [currentFormValues, setCurrentFormValues] =
    useState<MyProfileFormValues>(initialValues);

  useEffect(() => {
    setCurrentFormValues(initialValues);
  }, [initialValues]);

  const handleSubmit = async (
    values: MyProfileFormValues,
    helpers: FormikHelpers<MyProfileFormValues>,
  ) => {
    if (profileLoading) return;
    setProfileLoading(true);
    try {
      const updatedData = {
        name: values.name,
        email: values.email,
      };

      const result = await updateUser(updatedData).unwrap();
      console.warn("Update user result: ", result);
      dispatch(
        setUserDetail({
          name: values.name,
          emailID: values.email,
        }),
      );

      setCurrentFormValues(values);
      helpers.resetForm({ values });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      toast.error(getErrorMessage(err));
      helpers.setStatus({ error: "Failed to update profile" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleBackClick = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      router.back();
    }
  };

  return (
    <Formik
      initialValues={currentFormValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      key={`${currentFormValues.name}-${currentFormValues.email}-${currentFormValues.phoneNumber}`}
    >
      {({
        isSubmitting,
        dirty,
        resetForm,
        initialValues: formInitialValues,
        submitForm,
      }) => {
        const handleCancel = () => {
          resetForm({ values: formInitialValues });
          setEditMode(false);
        };

        const updatingProfile = isSubmitting;
        const noChanges = !dirty;

        const getButtonContent = (text: string) => (
          <>{updatingProfile ? <Spinner size="sm" /> : text}</>
        );

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
                  <footer className="mt-6 border-t-2 pt-4 flex justify-between">
                    <button
                      type="button"
                      className="px-3 py-1 md:px-5 md:py-2 border rounded-lg shadow-sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitForm}
                      className={`px-3 py-1 md:px-5 md:py-2 text-white rounded-lg shadow-sm ${updatingProfile || noChanges ? "disabled:cursor-not-allowed disabled:bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                      disabled={updatingProfile || noChanges}
                    >
                      {getButtonContent(
                        noChanges ? "No Changes" : "Save Changes",
                      )}
                    </button>
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
                <MobileHeader.Title>My Profile</MobileHeader.Title>
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
                  <button
                    type="button"
                    onClick={submitForm}
                    className={`px-4 py-3 text-white rounded-xl ${updatingProfile || noChanges ? "disabled:cursor-not-allowed disabled:bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                    disabled={updatingProfile || noChanges}
                  >
                    {getButtonContent(
                      noChanges ? "No Changes" : "Save Changes",
                    )}
                  </button>
                </MobileFooter>
              )}
            </div>
          </>
        );
      }}
    </Formik>
  );
}

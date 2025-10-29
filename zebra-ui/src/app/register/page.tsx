"use client";

import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import HouseClaySvg from "public/icons/houseclay.svg";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormInputField from "@/components/common/FormInputField";
import { authFailure, authSuccess } from "@/store/adminAuthSlice";
import { useLoginMutation, useRegisterMutation } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { toErrorMessage } from "@/utils/rtkError";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface RegisterFormValues {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

export default function AdminRegister() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, authError } = useSelector(
    (state: RootState) => state.adminAuth,
  );
  const [registerUser, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [loginUser, { isLoading: isLoginLoading }] = useLoginMutation();

  const initialValues: RegisterFormValues = {
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (
    values: RegisterFormValues,
    formikHelpers: FormikHelpers<RegisterFormValues>,
  ) => {
    try {
      await registerUser({
        username: values.username,
        password: values.password,
        name: values.name,
      }).unwrap();
      await loginUser({
        username: values.username,
        password: values.password,
      }).unwrap();

      dispatch(authSuccess());
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      dispatch(authFailure(toErrorMessage(err)));
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center mx-auto w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/3">
        <div className="flex items-center mb-4 text-3xl gap-2">
          <HouseClay />
          <span className="text-red-600 text-lg font-nunito font-bold">
            HouseClay
          </span>
        </div>

        <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create a new account
            </h1>

            <Formik
              initialValues={initialValues}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <FormInputField
                    name="name"
                    label="Name"
                    placeholder="Enter your full name"
                    dataType="text"
                    required
                  />

                  <FormInputField
                    name="username"
                    label="Username"
                    placeholder="Choose a username"
                    dataType="text"
                    required
                  />

                  <FormInputField
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    dataType="password"
                    required
                  />

                  <FormInputField
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="••••••••"
                    dataType="password"
                    required
                  />

                  {authError && (
                    <div className="text-red-500 text-sm text-center">
                      {authError ??
                        "Error with registration. Please try again later!"}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || isRegisterLoading || isLoginLoading
                    }
                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegisterLoading || isLoginLoading
                      ? "Authenticating..."
                      : "Register"}
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="font-medium text-red-600 hover:underline dark:text-red-500"
                    >
                      Sign in
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}

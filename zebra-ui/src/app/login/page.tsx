"use client";

import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { houseclayIconURL } from "@/common/constants/cdnURLs";
import { FormTextField } from "@/form-components";
import { authFailure, authStarted, authSuccess } from "@/store/adminAuthSlice";
import { useLoginMutation } from "@/store/apiSlice";
import { RootState } from "@/store/store";
import RemoteSvg from "@/utility-components/RemoteSvg";
import { toErrorMessage } from "@/utils/rtkError";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function AdminLogin() {
  const dispatch = useDispatch();

  const { authError } = useSelector((state: RootState) => state.adminAuth);

  const [loginUser, { isLoading, isError }] = useLoginMutation();

  const handleSubmit = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>,
  ) => {
    dispatch(authStarted());
    try {
      await loginUser({
        username: values.username,
        password: values.password,
      }).unwrap();

      dispatch(authSuccess());
      const from = new URLSearchParams(window.location.search).get("from");
      window.location.replace(from || "/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      dispatch(authFailure(toErrorMessage(err)));
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <section
      className="bg-gray-100 h-screen flex justify-center items-center"
      data-testid="page-login"
    >
      <div className="flex flex-col items-center justify-center mx-auto w-4/5 md:w-2/3 lg:w-3/5 xl:w-1/2 2xl:w-2/5">
        <div className="flex items-center mb-4 gap-1">
          <RemoteSvg src={houseclayIconURL} className="size-7" />
          <span className="text-red-500 text-2xl font-nunito font-bold">
            ZEBRA | houseclay
          </span>
        </div>

        <div className="w-full bg-white rounded-lg shadow">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>

            <Formik
              initialValues={{
                username: "",
                password: "",
                rememberMe: false,
              }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <FormTextField
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    dataType="string"
                    required
                    // testId="login-username"
                  />

                  <FormTextField
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    dataType="string"
                    required
                    // testId="login-password"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        data-testid="login-remember-input"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 cursor-pointer"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="ml-2 text-sm font-medium text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-red-600 hover:underline"
                      data-testid="login-forgot-password"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {(isError || authError) && (
                    <div className="text-red-500 text-sm text-center">
                      {authError ?? "Error with login. Please try again later!"}
                    </div>
                  )}
                  <button
                    data-testid="login-submit-button"
                    aria-label="sign-in"
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing in…" : "Sign in"}
                  </button>

                  <p className="text-sm font-light text-gray-500">
                    Don&apos;t have an account yet?{" "}
                    <a
                      href="/register"
                      className="font-medium text-red-600 hover:underline"
                    >
                      Sign up
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

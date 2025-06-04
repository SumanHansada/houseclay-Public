"use client";

import React, { useEffect } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import HouseClaySvg from "public/icons/houseclay.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

import FormInputField from "@/components/common/FormInputField";
import { loginStart, loginSuccess, loginFailure } from "@/store/adminSlice";
import { useLoginMutation } from "@/store/apiSlice";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

export default function AdminLogin() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Pull token & any error state from Redux; loading is handled by RTK Query
  const { token, error: reduxError } = useSelector(
    (state: RootState) => state.admin,
  );

  // Use the RTK Query login mutation (expects `{ username, password }`)
  const [loginUser, { isLoading: loginLoading, isError: loginError }] =
    useLoginMutation();

  // If already authenticated, redirect to /admin/dashboard
  useEffect(() => {
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [token, router]);

  const handleSubmit = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>,
  ) => {
    try {
      dispatch(loginStart());

      // Call RTK Query login, passing { username, password }
      const returnedToken = await loginUser({
        username: values.username,
        password: values.password,
      }).unwrap();

      dispatch(loginSuccess(returnedToken));
      // console.log(returnedToken);

      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      dispatch(loginFailure("Invalid username or password"));
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

        <div className="w-full bg-white rounded-lg shadow dark:border  dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
                  <FormInputField
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Display any Redux error message */}
                  {(reduxError || loginError) && (
                    <div className="text-red-500 text-sm text-center">
                      {reduxError || "Invalid username or password"}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || loginLoading}
                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loginLoading ? "Signing in…" : "Sign in"}
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account yet?{" "}
                    <a
                      href="/register"
                      className="font-medium text-red-600 hover:underline dark:text-red-500"
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

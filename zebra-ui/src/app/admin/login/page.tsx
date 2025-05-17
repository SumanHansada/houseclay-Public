"use client";

import axios from "axios";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import HouseClaySvg from "public/icons/houseclay.svg";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormInputField from "@/app/components/common/FormInputField";
import { loginFailure, loginStart, loginSuccess } from "@/store/adminSlice";
import { RootState } from "@/store/store";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export default function AdminLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const { loading, error, token } = useSelector(
    (state: RootState) => state.admin,
  );

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [token, router]);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      dispatch(loginStart());
      const response = await axios.post("/api/admin/login", values);
      dispatch(loginSuccess(response.data));
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      dispatch(loginFailure("Login failed"));
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl gap-2">
          <HouseClay />
          <span className="text-red-600 text-lg font-nunito font-bold">
            HouseClay
          </span>
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <Formik
              initialValues={{ username: "", password: "", rememberMe: false }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {() => (
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
                    dataType="text"
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

                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account yet&lsquo;{" "}
                    <a
                      href="/admin/register"
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

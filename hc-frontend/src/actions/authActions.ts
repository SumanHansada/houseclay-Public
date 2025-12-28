"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

import { AuthUserDetail } from "@/interfaces/User";
import serverAxiosInstance from "@/services/serverAxiosInstance";

interface LoginParams {
  phoneNo: string;
  otpCode: string;
}

interface RegisterParams {
  phoneNo: string;
  name: string;
  emailID: string;
  otpCode: string;
}

/**
 * Server action for user login
 * Handles cookie setting from backend response
 */
export async function loginAction(
  params: LoginParams,
): Promise<{ success: boolean; data?: AuthUserDetail; error?: string }> {
  try {
    console.log("[Server Action] Calling Backend Login");

    const response = await serverAxiosInstance.post("/user/login", {
      phoneNo: params.phoneNo,
      otpCode: params.otpCode,
    });

    // Extract Set-Cookie headers from response
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      // Parse cookies from Set-Cookie header
      // setCookieHeader can be a string or array of strings
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      const parsedCookies = setCookieParser.parse(cookieArray) as Array<{
        name: string;
        value: string;
        domain?: string;
        httpOnly?: boolean;
        secure?: boolean;
        maxAge?: number;
        path?: string;
        sameSite?: string;
      }>;

      const cookieStore = await cookies();

      // Set each cookie in Next.js cookie store
      parsedCookies.forEach((cookie) => {
        console.log(`[Server Action] Setting cookie: ${cookie.name}`);
        cookieStore.set({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          httpOnly: cookie.httpOnly ?? false,
          secure: cookie.secure ?? true,
          maxAge: cookie.maxAge,
          path: cookie.path || "/",
          sameSite: (cookie.sameSite as "strict" | "lax" | "none") || "lax",
        });
      });
    }

    // Parse response data
    let userData: AuthUserDetail;
    const contentType = response.headers["content-type"];

    if (contentType?.includes("application/json")) {
      userData = response.data as AuthUserDetail;
    } else {
      // If response is plain text, try to parse it
      const textData = response.data as string;
      try {
        userData = JSON.parse(textData) as AuthUserDetail;
      } catch {
        throw new Error("Invalid response format from server");
      }
    }

    // Revalidate paths that depend on authentication
    revalidatePath("/");
    revalidatePath("/manage-account");

    return { success: true, data: userData };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Server Action] Login failed", error);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";

    return { success: false, error: errorMessage };
  }
}

/**
 * Server action for user registration
 * Handles cookie setting from backend response
 */
export async function registerAction(
  params: RegisterParams,
): Promise<{ success: boolean; data?: AuthUserDetail; error?: string }> {
  try {
    console.log("[Server Action] Calling Backend Register");

    const response = await serverAxiosInstance.post("/user/register", {
      phoneNo: params.phoneNo,
      name: params.name,
      emailID: params.emailID,
      otpCode: params.otpCode,
    });

    // Extract Set-Cookie headers from response
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      // Parse cookies from Set-Cookie header
      // setCookieHeader can be a string or array of strings
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      const parsedCookies = setCookieParser.parse(cookieArray) as Array<{
        name: string;
        value: string;
        domain?: string;
        httpOnly?: boolean;
        secure?: boolean;
        maxAge?: number;
        path?: string;
        sameSite?: string;
      }>;

      const cookieStore = await cookies();

      // Set each cookie in Next.js cookie store
      parsedCookies.forEach((cookie) => {
        console.log(`[Server Action] Setting cookie: ${cookie.name}`);
        cookieStore.set({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          httpOnly: cookie.httpOnly ?? false,
          secure: cookie.secure ?? true,
          maxAge: cookie.maxAge,
          path: cookie.path || "/",
          sameSite: (cookie.sameSite as "strict" | "lax" | "none") || "lax",
        });
      });
    }

    // Parse response data
    const userData = response.data as AuthUserDetail;

    // Revalidate paths that depend on authentication
    revalidatePath("/");
    revalidatePath("/manage-account");

    return { success: true, data: userData };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Server Action] Register failed", error);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Registration failed";

    return { success: false, error: errorMessage };
  }
}

/**
 * Server action for user logout
 * Clears authentication cookies
 */
export async function logoutAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log("[Server Action] Calling Backend Logout");

    // Forward cookies from request to backend
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await serverAxiosInstance.post(
      "/user/logout",
      {},
      {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      },
    );

    // Extract Set-Cookie headers from response (for clearing cookies)
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      // setCookieHeader can be a string or array of strings
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      const parsedCookies = setCookieParser.parse(cookieArray) as Array<{
        name: string;
        value: string;
        domain?: string;
        httpOnly?: boolean;
        secure?: boolean;
        maxAge?: number;
        path?: string;
        sameSite?: string;
      }>;

      // Clear cookies by setting maxAge to 0
      parsedCookies.forEach((cookie) => {
        cookieStore.set({
          name: cookie.name,
          value: "",
          domain: cookie.domain,
          httpOnly: cookie.httpOnly ?? false,
          secure: cookie.secure ?? true,
          maxAge: 0,
          path: cookie.path || "/",
          sameSite: (cookie.sameSite as "strict" | "lax" | "none") || "lax",
        });
      });
    }

    revalidatePath("/");
    revalidatePath("/manage-account");

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Server Action] Logout failed", error);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Logout failed";

    return { success: false, error: errorMessage };
  }
}

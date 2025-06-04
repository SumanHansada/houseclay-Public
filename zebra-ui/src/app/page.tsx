"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Home() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.admin.token);

  useEffect(() => {
    if (token) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router, token]);
  return null;
}

// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function Home() {
//   const router = useRouter();
//   useEffect(() => {
//     router.replace("/admin/dashboard");
//   }, [router]);
//   return null;
// }

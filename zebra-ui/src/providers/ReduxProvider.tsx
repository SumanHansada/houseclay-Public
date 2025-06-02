"use client";

import { Provider } from "react-redux";

import { store } from "@/store/store";
import React from "react";
import SeedCache from "@/mock/SeedCache";
// import { initializeToken } from "@/store/adminSlice";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* <SeedCache /> */}
      {/* <InitAuth> */}
      {children}
      {/* </InitAuth> */}
    </Provider>
  );
}

// function InitAuth({ children }: { children: React.ReactNode }) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(initializeToken());
//   }, [dispatch]);

//   return <>{children}</>;
// }

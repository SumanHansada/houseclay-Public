"use client";

import { LoginDialog, MenuDialog } from "@/dialogs";
import { useDialog } from "@/providers/DialogContextProvider";

import Header from "./Header";
import StickyNavbar from "./StickyNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDialogOpen } = useDialog();

  return (
    <>
      <Header />
      <main className="mx-auto my-0 pt-14 pb-16 min-h-fit flex-1 flex flex-wrap justify-center">
        {children}
      </main>

      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && <LoginDialog id="login-dialog" />}

      {/* Menu Dialog */}
      {isDialogOpen("menu-dialog") && <MenuDialog id="menu-dialog" />}

      <StickyNavbar />
    </>
  );
}

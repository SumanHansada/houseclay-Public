"use client";

import { LoginDialog } from "@/dialogs";
import { useDialog } from "@/providers/DialogContextProvider";

const LoginWrapper: React.FC = () => {
  const { isDialogOpen } = useDialog();
  return (
    <>{isDialogOpen("login-dialog") && <LoginDialog id="login-dialog" />}</>
  );
};

export default LoginWrapper;

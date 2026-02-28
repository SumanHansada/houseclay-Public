"use client";

import {
  CALL_WITH_CAPTAIN_DIALOG_ID,
  LOGIN_DIALOG_ID,
  MENU_DIALOG_ID,
  BUY_CONNECTS_DIALOG_ID,
} from "@/common/dialogConstants";

import { CallWithCaptainDialog, LoginDialog, MenuDialog, BuyConnectsDialog } from "@/dialogs";

import { useDialog } from "@/providers/DialogContextProvider";

const CommonDialogs: React.FC = () => {
  const { isDialogOpen } = useDialog();
  return (
    <>
      {/* Login Dialog */}
      {isDialogOpen(LOGIN_DIALOG_ID) && <LoginDialog id={LOGIN_DIALOG_ID} />}
      {/* Menu Dialog */}
      {isDialogOpen(MENU_DIALOG_ID) && <MenuDialog id={MENU_DIALOG_ID} />}
      {/* Call with Captain Dialog */} {/* Call with Captain Dialog */}
      {isDialogOpen(CALL_WITH_CAPTAIN_DIALOG_ID) && (
        <CallWithCaptainDialog id={CALL_WITH_CAPTAIN_DIALOG_ID} />
      )}
      {/* Buy Connects Dialog */}
      {isDialogOpen(BUY_CONNECTS_DIALOG_ID) && (
        <BuyConnectsDialog id={BUY_CONNECTS_DIALOG_ID} />
      )}
    </>
  );
};

export default CommonDialogs;

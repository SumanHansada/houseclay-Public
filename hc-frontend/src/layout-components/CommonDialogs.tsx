"use client";

import {
  CallWithCaptainDialog,
  DeletePhotosDialog,
  LoginDialog,
  MenuDialog,
  UpgradePropertyDialog,
  UploadPhotosDialog,
} from "@/dialogs";
import { useDialog } from "@/providers/DialogContextProvider";

const CommonDialogs: React.FC = () => {
  const { isDialogOpen } = useDialog();
  return (
    <>
      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && <LoginDialog id="login-dialog" />}
      {/* Menu Dialog */}
      {isDialogOpen("menu-dialog") && <MenuDialog id="menu-dialog" />}
      {/* Upload Dialog */}
      {isDialogOpen("upload-photos-dialog") && (
        <UploadPhotosDialog id="upload-photos-dialog" />
      )}
      {/* Delete Dialog */}
      {isDialogOpen("delete-photos-dialog") && (
        <DeletePhotosDialog id="delete-photos-dialog" />
      )}
      {/* Call with Captain Dialog */} {/* Call with Captain Dialog */}
      {isDialogOpen("call-with-captain-dialog") && (
        <CallWithCaptainDialog id="call-with-captain-dialog" />
      )}
      {/* Upgrade Property Dialog */}
      {isDialogOpen("upgrade-property-dialog") && (
        <UpgradePropertyDialog id="upgrade-property-dialog" />
      )}
    </>
  );
};

export default CommonDialogs;

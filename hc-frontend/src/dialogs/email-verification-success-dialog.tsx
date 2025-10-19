import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import EmailVerifiedIconSvg from "public/icons/email-verified.svg";

import { Button } from "@/base-components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { SvgIcon } from "@/utility-components";

const EmailVerifiedIcon = EmailVerifiedIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface EmailVerificationSuccessDialogProps {
  id: string;
  onClose: () => void;
}

const EmailVerificationSuccessDialog: React.FC<
  EmailVerificationSuccessDialogProps
> = ({ id, onClose }) => {
  const { isMobile } = useDeviceContext();
  const router = useRouter();

  return (
    <Dialog
      id={id}
      type={isMobile ? "bottom-sheet" : "card"}
      onClose={onClose}
      width={isMobile ? 100 : 20}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        {isMobile && (
          <MobileHeader className="relative">
            <MobileHeader.Title>Email Verified!</MobileHeader.Title>
            <MobileHeader.RightAction>
              <Button
                variant="secondary"
                size="custom"
                className="rounded-full p-1"
                onClick={onClose}
              >
                <X size={24} />
              </Button>
            </MobileHeader.RightAction>
          </MobileHeader>
        )}
      </DialogHeader>
      <DialogContent>
        <div className="p-6 flex flex-col gap-4 items-center">
          <EmailVerifiedIcon />
          <div className="text-center w-11/12 mb-2">
            <h1 className="text-3xl font-medium mb-1 max-md:hidden">
              Email Verified!
            </h1>
            <p className="text-gray-700 text-lg">
              Great job! Your email is now verified, and you&apos;ve
              earned&nbsp;
              <span className="inline-flex items-center align-middle gap-1 mx-1">
                <SvgIcon iconSize="medium" name="coin" size={18} />
                <b>1 Connect</b>
              </span>
              &nbsp;to help you list and manage your property.
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center max-md:hidden">
            <button
              className="w-fit text-white py-3 px-4 rounded-lg bg-red-500"
              onClick={() => {
                router.push("/");
                onClose();
              }}
            >
              Explore Properties
            </button>
            <button onClick={onClose}>Go to My account</button>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-between md:hidden">
          <button
            type="button"
            className="border rounded-lg py-3 px-4"
            onClick={onClose}
          >
            Back
          </button>
          <button
            className="w-fit text-white py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600"
            onClick={() => {
              router.push("/");
              onClose();
            }}
          >
            Explore Properties
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default EmailVerificationSuccessDialog;

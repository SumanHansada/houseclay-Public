import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { X } from "lucide-react";

import EmailVerifiedIconSvg from "public/icons/email-verified.svg";
import CoinIconSvg from "public/icons/coin.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const EmailVerifiedIcon = EmailVerifiedIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const CoinIcon = CoinIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

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
      exitAnimation={isMobile ? "animate-slide-out-top" : "animate-fade-out"}
    >
      <DialogHeader>
        <div
          className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
        >
          {isMobile && (
            <h1 className="text-xl py-1.5 text-black">
              Verify your email address
            </h1>
          )}
          <button className="absolute top-4 right-4 rounded-full">
            <X onClick={onClose} size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className="p-6 flex flex-col gap-4 items-center">
          <EmailVerifiedIcon />
          <div className="text-center w-3/4 mb-2">
            <h1 className="text-3xl font-medium mb-1">Email Verified!</h1>
            <p className="text-gray-700 text-lg">
              Great job! Your email is now verified, and you've earned&nbsp;
              <span className="inline-flex items-center align-middle gap-1 mx-1">
                <Image
                  src="/icons/coin.svg"
                  alt="coin icon"
                  width={18}
                  height={18}
                />
                <b>1 Connect</b>
              </span>
              &nbsp;to help you list and manage your property.
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
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
    </Dialog>
  );
};

export default EmailVerificationSuccessDialog;

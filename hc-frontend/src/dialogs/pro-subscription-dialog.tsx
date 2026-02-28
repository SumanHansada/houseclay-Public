import { CalendarClock, HandCoins, UserStar, X } from "lucide-react";

import { Button } from "@/base-components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

interface ProSubscriptionDialogProps {
  id: string;
}

const ProSubscriptionDialog = ({ id }: ProSubscriptionDialogProps) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog } = useDialog();

  const onClose = () => {
    closeDialog(id);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Houseclay Pro</MobileHeader.Title>
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
      </DialogHeader>
      <DialogContent>
        <div className="px-8 py-4 flex flex-col gap-4 items-center justify-center h-full">
          <div className="w-full h-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-1 items-center justify-center">
              <h2 className="text-2xl font-medium">Houseclay PRO</h2>
              <p className="text-sm">Get more value with Houseclay PRO</p>
            </div>
            <ul className="w-full flex flex-col gap-1 list-disc py-2 px-6 border rounded-lg bg-linear-to-r from-gray-50 to-gray-200">
              <li>Verified listings.</li>
              <li>Zero Brokerage - Directly contact owners.</li>
              <li>Contacting an Owner uses 1 Connect.</li>
            </ul>

            <div className="w-full flex gap-2">
              <div className="w-1/3 border border-gray-200 rounded-lg p-1.5 h-full flex flex-col items-center justify-center gap-2">
                <div>
                  <HandCoins size={24} />
                </div>
                <span className="text-xs">30 Connects</span>
              </div>
              <div className="w-1/3 border border-gray-200 rounded-lg p-1.5 h-full flex flex-col items-center justify-center gap-2">
                <div>
                  <CalendarClock size={24} />
                </div>
                <span className="text-xs">30 Days</span>
              </div>
              <div className="w-1/3 border border-gray-200 rounded-lg p-1.5 h-full flex flex-col items-center justify-center gap-2">
                <div>
                  <UserStar size={24} />
                </div>
                <span className="text-xs">Verified Badge</span>
              </div>
            </div>

            <p className="text-xs text-center">
              Get 30 Connects. <br />
              Each Connect Represents unlocking 1 Owner&apos;s Contact.
            </p>
          </div>

          <div className="w-full h-full flex flex-col gap-4"></div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={onClose} className="rounded-lg ml-auto">
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ProSubscriptionDialog;

"use client";

import { X } from "lucide-react";

import { Button } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { MobileHeader } from "@/layout-components";

interface MonthlyChargesDialogProps {
  id: string;
  onClose: () => void;
  rent: string;
  maintenance: string;
}

const MonthlyChargesDialog: React.FC<MonthlyChargesDialogProps> = ({
  id,
  onClose,
  rent,
  maintenance,
}) => {
  return (
    <Dialog
      id={id}
      type="bottom-sheet"
      onClose={onClose}
      width={100}
      entryAnimation="animate-slide-in-bottom"
      exitAnimation="animate-slide-out-bottom"
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative">
          <MobileHeader.Title>Monthly Charges</MobileHeader.Title>
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
        <div className="p-3 flex gap-4 items-center justify-between text-lg">
          <div className="flex gap-2">
            <span>Rent:</span>
            <span>{rent}</span>
          </div>
          <div className="flex gap-2">
            <span>Maintenance:</span>
            <span>{maintenance}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyChargesDialog;

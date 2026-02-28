"use client";

import {
  CalendarClock,
  CheckCircle2,
  HandCoins,
  UserStar,
  X,
} from "lucide-react";
import { useState } from "react";

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
  const [selectedOption, setSelectedOption] = useState<
    "corporate" | "no-corporate"
  >("corporate");
  const [email, setEmail] = useState("");

  const onClose = () => closeDialog(id);

  // Handlers (kept placeholders for brevity)
  const handleVerifyEmail = () => console.log("Verify email");
  const handleProceedToPay = () => console.log("Proceed to pay");

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-bottom" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-bottom" : "animate-fade-out"}
    >
      <DialogHeader className="-mx-4">
        <MobileHeader className="relative border-b-0">
          <MobileHeader.Title>Houseclay PRO</MobileHeader.Title>
          <MobileHeader.RightAction>
            <Button
              variant="secondary"
              size="custom"
              className="rounded-full p-2 hover:bg-neutral-100"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </MobileHeader.RightAction>
        </MobileHeader>
      </DialogHeader>

      <DialogContent>
        <div className="flex flex-col h-full">
          {/* HERO SECTION */}
          <div className="px-6 py-6 flex flex-col gap-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">
                Unlock <span className="text-red-600">Houseclay PRO</span>
              </h2>
              <p className="text-sm text-gray-500">
                Connect directly with owners. Zero Brokerage.
              </p>
            </div>

            {/* GRADIENT FIX: keeping it solid red until 80%, then fading to amber */}
            <div className="w-full rounded-xl p-px shadow-sm bg-gradient-to-r from-red-600 via-red-500 via-80% to-amber-300">
              <div className="bg-white rounded-lg p-4">
                <ul className="flex flex-col gap-2">
                  {[
                    "100% Verified Listings",
                    "Zero Brokerage - Direct Owner Contact",
                    "No Spam",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm font-medium text-gray-700"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-red-500 shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* INFO CARDS - Cleaned up to flat design for better readability */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: HandCoins, label: "30 Connects", sub: "For Contacts" },
                { icon: CalendarClock, label: "30 Days", sub: "Validity" },
                { icon: UserStar, label: "Verified", sub: "Badge" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-100 text-center gap-2 shadow-sm"
                >
                  <div className="p-2 bg-white rounded-full shadow-sm text-red-500">
                    <item.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">
                      {item.label}
                    </span>
                    <span className="text-xxs text-gray-500">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SELECTION SECTION */}
          <div className="flex flex-col gap-3 px-6 pb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Standard Plan
            </p>

            {/* Corporate Option */}
            <div
              onClick={() => setSelectedOption("corporate")}
              className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selectedOption === "corporate"
                  ? "border-red-500 bg-red-50 ring-1 ring-red-500 shadow-md"
                  : "border-neutral-100 hover:border-red-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedOption === "corporate"
                        ? "border-red-600 bg-red-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedOption === "corporate" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold ${selectedOption === "corporate" ? "text-red-900" : "text-gray-700"}`}
                    >
                      I have a Corporate Email
                    </span>
                    {selectedOption !== "corporate" && (
                      <span className="text-xs text-green-600 font-medium">
                        Get it for FREE
                      </span>
                    )}
                  </div>
                </div>
                {/* Price Tag */}
                {/* {selectedOption === "corporate" && ( */}
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 line-through">
                    ₹1499
                  </span>
                  <span className="text-lg font-bold text-green-600">FREE</span>
                </div>
                {/* )} */}
              </div>

              {selectedOption === "corporate" && (
                <div className="mt-4 pl-8 animate-fade-in space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Verify your work email to unlock 30 connects instantly.
                  </p>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>

            {/* No Corporate Option */}
            <div
              onClick={() => setSelectedOption("no-corporate")}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selectedOption === "no-corporate"
                  ? "border-red-500 bg-red-50 ring-1 ring-red-500 shadow-md"
                  : "border-gray-200 hover:border-red-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedOption === "no-corporate"
                        ? "border-red-600 bg-red-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedOption === "no-corporate" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold ${selectedOption === "no-corporate" ? "text-red-900" : "text-gray-700"}`}
                  >
                    I don&apos;t have a Corporate Email
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">₹1499</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogFooter className="p-4 border-t bg-gray-50/50">
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-lg"
          >
            Close
          </Button>
          <Button
            onClick={
              selectedOption === "corporate"
                ? handleVerifyEmail
                : handleProceedToPay
            }
            className="flex-1 rounded-lg shadow-lg shadow-red-200"
          >
            {selectedOption === "corporate" ? "Verify & Unlock" : "Pay ₹1499"}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default ProSubscriptionDialog;

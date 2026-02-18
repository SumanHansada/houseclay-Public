"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button, NumberField, PhoneField } from "@/base-components";
import { useAddConnectsMutation } from "@/store/apiSlice";
import { getErrorMessage } from "@/utils/rtkError";

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}
function normalizeIndianPhone(raw: string) {
  const digits = digitsOnly(raw);
  if (!digits) return "";
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

export const AddConnectsForm = () => {
  const [userPhoneNo, setUserPhoneNo] = useState("");
  const [connectsToAdd, setConnectsToAdd] = useState<number>(0);

  const [touched, setTouched] = useState({ phone: false, connects: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [addConnects, { isLoading }] = useAddConnectsMutation();

  // validation
  const phoneDigits = digitsOnly(userPhoneNo);
  const phoneOk = useMemo(
    () =>
      phoneDigits.length === 10 ||
      (phoneDigits.length === 12 && phoneDigits.startsWith("91")),
    [phoneDigits],
  );
  const connectsOk = useMemo(
    () =>
      Number.isFinite(connectsToAdd) &&
      connectsToAdd > 0 &&
      connectsToAdd <= 100,
    [connectsToAdd],
  );

  const phoneError =
    (touched.phone || submitAttempted) &&
    (!phoneDigits
      ? "Phone number is required."
      : !phoneOk
        ? "Enter a valid Indian phone number."
        : "");

  const connectsError =
    (touched.connects || submitAttempted) &&
    (!Number.isFinite(connectsToAdd)
      ? "Connects is required."
      : connectsToAdd < 0 || connectsToAdd > 100
        ? "Connects must be between 0 and 100."
        : "");

  const canSubmit = phoneOk && connectsOk && !isLoading;

  const handleAdd = async () => {
    setSubmitAttempted(true);
    setTouched({ phone: true, connects: true });

    if (!phoneOk || !connectsOk) {
      const firstInvalidId = !phoneOk
        ? "phoneNumber"
        : !connectsOk
          ? "connects"
          : null;
      if (firstInvalidId) document.getElementById(firstInvalidId)?.focus();
      return;
    }

    const phoneNo = normalizeIndianPhone(userPhoneNo);
    try {
      // Adjust payload keys if your API expects different names
      await addConnects({ phoneNo, connectCount: connectsToAdd }).unwrap();
      toast.success("Connects added successfully!");
      handleClear();
    } catch (err: unknown) {
      console.error(err);
      toast.error(getErrorMessage(err));
      handleClear();
    }
  };

  const handleClear = () => {
    setUserPhoneNo("");
    setConnectsToAdd(0);
    setTouched({ phone: false, connects: false });
    setSubmitAttempted(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden justify-center items-center">
      <div className="flex flex-col bg-white shadow-md rounded-xl overflow-hidden w-11/12">
        {/* Header */}
        <h2 className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm text-2xl flex items-center w-full justify-between px-8 py-4 font-medium">
          Add Connects to Houseclay Users
        </h2>

        {/* Content */}
        <div className="flex gap-2 py-12 px-8">
          <PhoneField
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            defaultCountry="in"
            placeholder="Enter phone number"
            value={userPhoneNo}
            onChange={(val: string) => setUserPhoneNo(val)}
            onBlur={() =>
              setTouched((touched) => ({ ...touched, phone: true }))
            }
            className="border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-red-500 focus:border-red-500"
            required
            error={phoneError || undefined}
          />

          <NumberField
            id="connects"
            name="connects"
            label="Connects to add"
            value={connectsToAdd}
            min={0}
            max={100}
            step={1}
            onChange={(n) => setConnectsToAdd(Number.isFinite(n) ? n : 0)}
            onBlur={() =>
              setTouched((touched) => ({ ...touched, connects: true }))
            }
            className="px-3 focus:ring-red-500 focus:border-red-500 w-full mb-0"
            required
            error={connectsError || undefined}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end px-8 py-4 gap-3 border-t border-gray-100 shadow-sm">
          <Button
            variant="secondary"
            onClick={handleClear}
            className="rounded-xl px-8 text-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!canSubmit}
            className="rounded-xl disabled:opacity-50 disabled:cursor-not-allowed px-8 text-lg"
          >
            {isLoading ? "Adding…" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
};

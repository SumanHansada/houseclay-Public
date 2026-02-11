"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { NumberField, PhoneField } from "@/base-components";
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

export default function AddConnectsPage() {
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
      connectsToAdd >= 0 &&
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
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 h-full w-full bg-white">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-semibold mb-6">Add Connects</h1>

          <div className="flex gap-2 w-full">
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
              className="border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-red-500 focus:border-red-500 w-full"
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
              className="px-3 focus:ring-red-500 focus:border-red-500 w-full"
              required
              error={connectsError || undefined}
            />
          </div>

          <div className="flex gap-3 pt-2 justify-end">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!canSubmit}
              className="border border-red-500 text-red-500 py-3 px-6 text-base font-medium rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              {isLoading ? "Adding…" : "Add"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-300 text-gray-700 py-3 px-6 text-base font-medium rounded-xl hover:bg-gray-100"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

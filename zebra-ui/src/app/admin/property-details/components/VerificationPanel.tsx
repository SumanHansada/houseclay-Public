"use client";

import { useEffect, useMemo, useState } from "react";

import { useVerifyPropertyMutation } from "@/store/apiSlice";
import { PanelSection } from "./PanelSection";
import { useRouter } from "next/navigation";
import { VerifyPropertyStatusEnum } from "@/common/enums";

interface VerificationPanelProps {
  /** Property ID from the page param */
  propertyID: string;
  /** Ref of the left‑hand scroll container (the Form wrapper) */
  formScrollRef: React.RefObject<HTMLFormElement | null>;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  propertyID,
  formScrollRef,
}) => {
  /* --------------------------- checkbox state --------------------------- */
  const [details, setDetails] = useState({
    propertyType: false,
    floorDetails: false,
    priceRange: false,
    descriptionMatch: false,
  });
  const [gallery, setGallery] = useState({
    noContactInfo: false,
    imagesAppropriate: false,
    noMisleading: false,
  });
  const [owner, setOwner] = useState({
    ownershipProof: false,
    notBroker: false,
    contactVerified: false,
  });

  const allDetailsChecked = useMemo(
    () => Object.values(details).every(Boolean),
    [details],
  );
  const allGalleryChecked = useMemo(
    () => Object.values(gallery).every(Boolean),
    [gallery],
  );
  const allOwnerChecked = useMemo(
    () => Object.values(owner).every(Boolean),
    [owner],
  );

  /* ----------------------- comment & scroll control --------------------- */
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [comment, setComment] = useState("");
  const router = useRouter();

  /* detect scroll‑to‑bottom on the left column */
  useEffect(() => {
    const el = formScrollRef.current;
    if (!el) return;
    const handler = () => {
      const reachedEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
      if (reachedEnd) setHasScrolledToEnd(true);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [formScrollRef]);

  const commentValid = comment.trim().length >= 3 && hasScrolledToEnd;
  const readyForVerification =
    allDetailsChecked && allGalleryChecked && allOwnerChecked && commentValid;

  /* --------------------------- RTK mutation ----------------------------- */
  const [verifyProperty, { isLoading }] = useVerifyPropertyMutation();

  const handleVerify = async () => {
    if (!readyForVerification) return;
    await verifyProperty({ propertyID, comment });
    router.push(
      `/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`,
    );
  };

  /* ---------------------------- render ---------------------------------- */
  return (
    <div className="w-1/3 bg-white rounded-xl p-6 flex flex-col shadow-sm overflow-y-auto flex-shrink-0">
      <h1 className="text-3xl font-bold border-b pb-4 mb-6">
        Verification Panel
      </h1>

      {/* SECTION – PROPERTY DETAILS */}
      <PanelSection
        title="Property Details"
        checklist={details}
        setChecklist={setDetails}
        items={[
          { key: "propertyType", label: "Property type correct" },
          { key: "floorDetails", label: "Floor details verified" },
          { key: "priceRange", label: "Price in market range" },
          { key: "descriptionMatch", label: "Description matches locality" },
        ]}
        complete={allDetailsChecked}
      />

      {/* SECTION – GALLERY */}
      <PanelSection
        title="Property Gallery"
        checklist={gallery}
        setChecklist={setGallery}
        items={[
          { key: "noContactInfo", label: "No contact info visible" },
          { key: "imagesAppropriate", label: "Images appropriate" },
          { key: "noMisleading", label: "No misleading / offensive content" },
        ]}
        complete={allGalleryChecked}
      />

      {/* SECTION – OWNER */}
      <PanelSection
        title="Owner Details"
        checklist={owner}
        setChecklist={setOwner}
        items={[
          { key: "ownershipProof", label: "Ownership proof checked" },
          { key: "notBroker", label: "Confirmed not broker" },
          { key: "contactVerified", label: "Contact info verified" },
        ]}
        complete={allOwnerChecked}
      />

      {/* TAG OWNER AS BROKER – placeholder */}
      <button
        type="button"
        onClick={() => console.log("TODO: tag owner as broker")}
        className="mt-4 w-full border border-yellow-500 text-yellow-600 py-2 rounded-xl hover:bg-yellow-50"
      >
        Tag Owner as Broker
      </button>

      {/* COMMENT */}
      <textarea
        className="mt-6 w-full border rounded-lg p-2 flex-shrink-0 h-24 resize-none "
        placeholder={
          hasScrolledToEnd
            ? "Add a comment (min 3 chars)…"
            : "Scroll through the form before commenting…"
        }
        rows={3}
        disabled={!hasScrolledToEnd}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button
          type="button"
          disabled={!commentValid}
          onClick={() => console.log("TODO: report / deactivate")}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Report / Deactivate
        </button>
        <button
          type="button"
          disabled={!readyForVerification || isLoading}
          onClick={handleVerify}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying…" : "Verify Property"}
        </button>
      </div>
    </div>
  );
};

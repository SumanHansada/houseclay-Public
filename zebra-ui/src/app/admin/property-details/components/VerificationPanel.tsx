"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { dialogLabels } from "@/common/constants";
import { VerifyPropertyStatusEnum } from "@/common/enums";
import { ActionDialog } from "@/dialogs/action-dialog";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useDeactivatePropertyMutation,
  useTagBrokerMutation,
  useVerifyPropertyMutation,
} from "@/store/apiSlice";

import { PanelSection } from "./PanelSection";

const VERIFY_DIALOG_ID = "verify-property-dialog";
const DEACTIVATE_DIALOG_ID = "report-property-dialog";
const TAG_BROKER_DIALOG_ID = "tag-broker-dialog";
interface VerificationPanelProps {
  propertyID: string;
  formScrollRef: React.RefObject<HTMLFormElement | null>;
  userPhoneNo: string;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  propertyID,
  formScrollRef,
  userPhoneNo,
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
  const { openDialog, isDialogOpen } = useDialog();

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

  const [score, setScore] = useState(0);
  const scoreOptions = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i + 1) * 10),
    [],
  );

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

  const commentValid = comment.trim().length >= 12 && hasScrolledToEnd;
  const readyForVerification =
    allDetailsChecked &&
    allGalleryChecked &&
    allOwnerChecked &&
    commentValid &&
    score > 0;

  /* --------------------------- RTK mutation ----------------------------- */
  const [verifyProperty] = useVerifyPropertyMutation();
  const [deactivateProperty] = useDeactivatePropertyMutation();
  const [tagBroker] = useTagBrokerMutation();

  const redirectToPropertyList = () => {
    router.push(
      `/admin/property-verification/${VerifyPropertyStatusEnum.VERIFY}`,
    );
  };

  const handleVerify = async () => {
    if (!readyForVerification) return;
    await verifyProperty({ propertyID, comment, score });
  };

  const handleDeactivate = async () => {
    if (!commentValid) return;
    await deactivateProperty({ propertyID, comment });
  };

  const handleTagBroker = async (commentFromDialog: string) => {
    await tagBroker({ phoneNo: userPhoneNo, comment: commentFromDialog });
    await deactivateProperty({ propertyID, comment: commentFromDialog });
  };

  const handleVerifyClicked = () => {
    openDialog(VERIFY_DIALOG_ID);
  };

  const handleDeactivateClicked = () => {
    openDialog(DEACTIVATE_DIALOG_ID);
  };

  const handleTagBrokerClicked = () => {
    openDialog(TAG_BROKER_DIALOG_ID);
  };

  /* ---------------------------- render ---------------------------------- */
  return (
    <div className="w-1/3 bg-white rounded-xl p-3 flex flex-col shadow-sm overflow-y-auto flex-shrink-0">
      <h1 className="text-3xl font-bold border-b py-1">Verification Panel</h1>

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

      {/* SECTION – SCORE PROPERTY (required) */}
      <div className="my-4">
        <h2 className="text-lg font-semibold mb-2">Score Property</h2>
        <fieldset
          className="grid grid-cols-5 gap-2"
          aria-label="Property score from 10 to 100"
        >
          {scoreOptions.map((val) => (
            <label
              key={val}
              className={`flex items-center justify-center rounded-lg border px-3 py-2 cursor-pointer select-none
                ${score === val ? "border-green-600 ring-1 ring-green-600" : "border-neutral-300 hover:border-neutral-400"}`}
            >
              <input
                type="radio"
                name="property-score"
                value={val}
                checked={score === val}
                onChange={() => setScore(val)}
                className="sr-only"
                aria-label={`Score ${val}`}
              />
              <span className="text-sm font-medium">{val}</span>
            </label>
          ))}
        </fieldset>
        <p className="mt-2 text-sm text-neutral-600">
          Score (required): {score > 0 ? score : "None"}
        </p>
      </div>

      {/* TAG OWNER AS BROKER – placeholder */}
      <button
        type="button"
        onClick={handleTagBrokerClicked}
        className="w-full border border-red-500 text-red-600 py-2 rounded-xl hover:bg-red-200"
      >
        Tag Owner as Broker
      </button>

      {/* COMMENT */}
      <textarea
        className="my-2 w-full border rounded-lg p-2 flex-shrink-0 h-24 resize-none "
        placeholder={
          hasScrolledToEnd
            ? "Add a comment (min 12 chars)…"
            : "Scroll through the form before commenting…"
        }
        rows={3}
        disabled={!hasScrolledToEnd}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 my-1">
        <button
          type="button"
          disabled={!commentValid}
          onClick={handleDeactivateClicked}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Deactivate Property
        </button>
        <button
          type="button"
          disabled={!readyForVerification}
          onClick={handleVerifyClicked}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Verify Property
        </button>
      </div>

      {isDialogOpen(VERIFY_DIALOG_ID) && (
        <ActionDialog
          id={VERIFY_DIALOG_ID}
          {...dialogLabels.verify}
          onConfirm={handleVerify}
          onSuccess={redirectToPropertyList}
        />
      )}

      {isDialogOpen(DEACTIVATE_DIALOG_ID) && (
        <ActionDialog
          id={DEACTIVATE_DIALOG_ID}
          {...dialogLabels.deactivate}
          onConfirm={handleDeactivate}
          onSuccess={redirectToPropertyList}
        />
      )}

      {isDialogOpen(TAG_BROKER_DIALOG_ID) && (
        <ActionDialog
          id={TAG_BROKER_DIALOG_ID}
          {...dialogLabels.tagBroker}
          onConfirm={handleTagBroker}
          onSuccess={redirectToPropertyList}
          requireComment
        />
      )}
    </div>
  );
};

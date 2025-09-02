"use client";

import { useFormik } from "formik";
import { X } from "lucide-react";
import * as Yup from "yup";

import { RadioGroup, TextArea } from "@/base-components";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
interface ReportListingDialogProps {
  id: string;
  propertyId?: string;
  onClose: () => void;
}

const reportOptions = [
  { value: "incorrect_information", label: "Incorrect information" },
  { value: "duplicate_listing", label: "Duplicate listing" },
  { value: "fraudulent_activity", label: "Fraudulent or suspicious activity" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "other", label: "Other" },
];

const getPlaceholderText = () => {
  return "Please provide additional details about your report...";
};

const validationSchema = Yup.object({
  reason: Yup.string().required("Please select a reason for reporting"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters")
    .required("Please provide additional details"),
});

const ReportListingDialog: React.FC<ReportListingDialogProps> = ({
  id,
  propertyId,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();

  const formik = useFormik({
    initialValues: {
      reason: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // TODO: Implement API call to submit report
        console.log("Submitting report:", { ...values, propertyId });

        // Close dialog and show success message
        onClose();
        // You can add a toast notification here
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    },
  });

  const handleReasonChange = (value: string) => {
    formik.setFieldValue("reason", value);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        <div
          className={`${isMobile ? "py-2 px-8" : ""} flex flex-col justify-between items-center w-full`}
        >
          {isMobile && (
            <h1 className="text-xl py-1.5 text-black">Report This Listing</h1>
          )}
          <button className="absolute top-4 right-4 rounded-full">
            <X onClick={onClose} size={24} />
          </button>
        </div>
      </DialogHeader>
      <DialogContent>
        <div className={`${isMobile ? "px-8" : "p-6"}`}>
          {!isMobile && (
            <h2 className="text-xl font-semibold mb-2">Report This Listing</h2>
          )}

          <p className="text-gray-600 mb-6">
            Help us maintain a safe and reliable platform. Let us know if this
            listing violates our policies or seems inaccurate.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <RadioGroup
              name="reason"
              label=""
              options={reportOptions}
              value={formik.values.reason}
              onChange={(value: string | boolean) =>
                handleReasonChange(value as string)
              }
              error={
                formik.touched.reason && formik.errors.reason
                  ? formik.errors.reason
                  : undefined
              }
              columns={1}
              horizontal={false}
              containerClassName="mb-6"
              radioOptionClassName="border border-gray-200 rounded-lg p-3 hover:border-red-400 transition-colors"
              radioLabelClassName="flex !justify-start cursor-pointer"
              radioInputClassName="mr-3"
              selectedColor="border-red-400"
            />

            <TextArea
              name="message"
              label="Message"
              placeholder={getPlaceholderText()}
              value={formik.values.message}
              onChange={(value: string) =>
                formik.setFieldValue("message", value)
              }
              onBlur={() => formik.setFieldTouched("message", true)}
              error={
                formik.touched.message && formik.errors.message
                  ? formik.errors.message
                  : undefined
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />

            {/* Mobile Footer */}
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {formik.isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Buttons */}
            {!isMobile && (
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportListingDialog;

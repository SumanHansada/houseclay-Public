"use client";

import { useFormik } from "formik";
import { X } from "lucide-react";
import * as Yup from "yup";

import { Button, RadioGroup, TextArea } from "@/base-components";
import { ReportStatus } from "@/common/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import { MobileFooter, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useReportPropertyMutation } from "@/store/apiSlice";
interface ReportListingDialogProps {
  id: string;
  propertyId: string;
  onClose: () => void;
}

const reportOptions = [
  { value: ReportStatus.BROKER, label: "Property is listed by a Broker" },
  { value: ReportStatus.INCORRECT_INFO, label: "Incorrect information" },
  {
    value: ReportStatus.RENTED_OUT,
    label: "Property is already rented out",
  },
  { value: ReportStatus.OTHER, label: "Other" },
];

const getPlaceholderText = () => {
  return "Please provide additional details about your report...";
};

const validationSchema = Yup.object({
  reportType: Yup.string().required("Please select a reason for reporting"),
  comment: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters")
    .required("Please provide additional details"),
});

const FORM_ID = "report-listing-form";

const ReportListingDialog: React.FC<ReportListingDialogProps> = ({
  id,
  propertyId,
  onClose,
}) => {
  const { isMobile } = useDeviceContext();
  const [reportProperty] = useReportPropertyMutation();

  const formik = useFormik({
    initialValues: {
      reportType: "",
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // TODO: Implement API call to submit report
        console.log("Submitting report:", { ...values, propertyId });
        const response = await reportProperty({
          propertyId: propertyId,
          payload: values,
        });
        console.log(response);

        // Close dialog and show success message
        onClose();
        // You can add a toast notification here
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    },
  });

  const handleReportTypeChange = (value: string) => {
    formik.setFieldValue("reportType", value);
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      onClose={onClose}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader className="max-md:-mx-4">
        {isMobile ? (
          <MobileHeader className="relative">
            <MobileHeader.Title>Report This Listing</MobileHeader.Title>
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
        ) : (
          <div className="relative w-full flex justify-between items-center">
            {
              <h1 className="text-xl md:text-2xl text-black">
                Report This Listing
              </h1>
            }
            <button className="relative rounded-full">
              <X onClick={onClose} size={24} />
            </button>
          </div>
        )}
      </DialogHeader>
      <DialogContent>
        <div className={`${isMobile ? "px-8 py-6" : "p-6"}`}>
          <p className="text-gray-600 mb-6">
            Help us maintain a safe and reliable platform. Let us know if this
            listing violates our policies or seems inaccurate.
          </p>

          <form
            id={FORM_ID}
            onSubmit={formik.handleSubmit}
            className="space-y-6"
          >
            <RadioGroup
              name="reportType"
              label=""
              options={reportOptions}
              value={formik.values.reportType}
              onChange={(value: string | boolean) =>
                handleReportTypeChange(value as string)
              }
              error={
                formik.touched.reportType && formik.errors.reportType
                  ? formik.errors.reportType
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
              name="comment"
              label="Comment"
              placeholder={getPlaceholderText()}
              value={formik.values.comment}
              onChange={(value: string) =>
                formik.setFieldValue("comment", value)
              }
              onBlur={() => formik.setFieldTouched("comment", true)}
              error={
                formik.touched.comment && formik.errors.comment
                  ? formik.errors.comment
                  : undefined
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </form>
        </div>
      </DialogContent>
      <DialogFooter>
        <MobileFooter>
          <div className="flex gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </MobileFooter>
        <div className="flex border-gray-200 w-full justify-end gap-4 max-md:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            disabled={!formik.isValid || formik.isSubmitting}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default ReportListingDialog;

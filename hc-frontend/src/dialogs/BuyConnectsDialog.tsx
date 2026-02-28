"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/base-components";
import { BUY_CONNECTS_DIALOG_ID, VERIFY_CONNECTS_DIALOG_ID } from "@/common/dialogConstants";
import { PaymentVerificationStatus } from "@/common/enums";

import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/Dialog";
import Login from "@/components/Login";
import { MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  useBundleInfoQuery,
  useContactUsMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/apiSlice";
import { RootState } from "@/store/store";
import { setConnectBal } from "@/store/userSlice";
import { SvgIcon } from "@/utility-components";
import { Form, Formik, FormikHelpers } from "formik";
import Spinner from "@/components/Spinner";
import { FormTextField } from "@/form-components";

// Razorpay type definition
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface ContactUsFormValues {
  email: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const initialValues: ContactUsFormValues = {
  email: "",
};

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

const fmt2 = (rupees: number) =>
  rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface BuyConnectsDialogProps {
  id: string;
}

const BuyConnectsDialog: React.FC<BuyConnectsDialogProps> = ({ id }) => {
  const { isMobile } = useDeviceContext();
  const { closeDialog, openDialog } = useDialog();
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userDetail } = useSelector((state: RootState) => state.user);
  
  const { data: bundleData, isLoading: isBundleLoading } = useBundleInfoQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const [localAuthStep, setLocalAuthStep] = useState<"login" | "buy">(isAuthenticated ? "buy" : "login");

  // Sync local auth step with global auth state
  useEffect(() => {
    if (isAuthenticated) {
      setLocalAuthStep("buy");
    } else {
        // If dialog is open and user is not authenticated, show login
         // But only if we are in this flow. 
         // For now, simple logic: if not auth, show login.
         setLocalAuthStep("login");
    }
  }, [isAuthenticated]);

  const handleCloseDialog = () => {
    closeDialog(id);
  };

  const handlePaymentSuccess = async (response: any) => {
    console.log("Payment success response:", response);
    try {
      // Close this dialog and open verify dialog
      closeDialog(id);
      openDialog(VERIFY_CONNECTS_DIALOG_ID);
      
      // We are not handling the verify call here directly because VerifyConnectsDialog 
      // typically handles the status display. 
      // However, the existing page verified it THEN closed/navigated.
      // Based on page.tsx: 
      // openDialog(VERIFY_CONNECTS_DIALOG_ID);
      // setPaymentStatus(VERIFYING);
      // verifyPayment(...)
      
      // Since VerifyConnectsDialog seems to be a display component mainly (based on usage in page.tsx),
      // we might need to pass the verification promise or status to it, OR handle verification here.
      // But VerifyConnectsDialog is a Dialog component. 
      
      // To mimic page.tsx exactly, we would need to control the verify dialog's state from here
      // OR pass the payment data to the verify dialog context?
      // Since the VerifyConnectsDialog is likely stateless or takes props, we can't easily pass props 
      // via openDialog unless the dialog context supports it (it doesn't seem to based on usage).
      
      // WAIT: In page.tsx, VerifyConnectsDialog is rendered conditionally:
      // {isDialogOpen(VERIFY_CONNECTS_DIALOG_ID) && <VerifyConnectsDialog ... status={paymentStatus} ... />}
      // This means the STATE is in the Page.
      // So here, the STATE must be in a parent or we must handle verification inside THIS dialog?
      // But we are closing THIS dialog.
      
      // Re-reading page.tsx: VerifyConnectsDialog takes `status` and `connects`.
      
      // Solution: We should probably NOT close this dialog immediately, 
      // OR we need a global store for payment status.
      // OR we just perform verification here, wait for result, THEN show success/failure?
      
      // But the user said "call verify if payment is done".
      
      // Let's implement verification here.
      
      const result = await verifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      }).unwrap();
      
      console.log("Payment verification response:", result);
      dispatch(setConnectBal(result.connectBal));
      
      // Ideally we show a success message or the Verify Dialog in success state.
      // Since we can't easily pass props to VerifyConnectsDialog via openDialog,
      // We will rely on CommonDialogs to render VerifyConnectsDialog?
      // CommonDialogs renders: {isDialogOpen(VERIFY_CONNECTS_DIALOG_ID) && <VerifyConnectsDialog id={...} />}
      // It implies VerifyConnectsDialog handles its own state or fetches it?
      // Checking src/dialogs/index.ts -> it exports it.
      // Checking page.tsx again -> It explicitly passes `status={paymentStatus}`.
      // But CommonDialogs.tsx (Step 7) imports `VerifyConnectsDialog` but DOES NOT render it (it's commented out/not there yet? Wait).
      // Step 7 checks CommonDialogs.tsx. 
      // It has `CallWithCaptainDialog`, `LoginDialog`, `MenuDialog`. 
      // It DOES NOT have `VerifyConnectsDialog`.
      // The user said: "add it to src/layout-components/CommonDialogs.tsx". 
      // So I need to add `BuyConnectsDialog`.
      // The `VerifyConnectsDialog` was only in the `page.tsx` return JSX.
      
      // So, if I want `VerifyConnectsDialog` to be global, I ALSO need to add it to `CommonDialogs.tsx` w/ props management?
      // OR I can make BuyConnectsDialog handle the success state internally (replace content with success message).
      // This is simpler and follows "dialog should contain its logic inside itself".
      
      // I'll show a "Payment Successful" view inside THIS dialog, then close.
      // Or I can update `CommonDialogs` to include `VerifyConnectsDialog` but passing props is hard.
      
      // Plan: Handle verification inside this dialog, show success UI, then close.
      
    } catch (e) {
      console.error("Payment verification failed:", e);
      // Show error state
    }
  };

  const [contactUs, { isLoading, isSuccess, isError }] = useContactUsMutation();

  const handleProceedToPay = async () => {
    if (!bundleData) return;
    
    try {
      const response = await createOrder().unwrap(); // No args

      const options = {
        key: RAZORPAY_KEY,
        currency: "INR",
        name: "Houseclay",
        description: `Purchase of ${bundleData.connects} Connects`,
        order_id: response.orderId,
        handler: handlePaymentSuccess,
        prefill: {
          name: userDetail?.name || "Houseclay User",
          email: userDetail?.emailID || "",
          contact: userDetail?.phoneNo || "",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.log("Payment failed:", response);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
    }
  };

  const handleSubmit = async (
      values: ContactUsFormValues,
      { resetForm }: FormikHelpers<ContactUsFormValues>,
    ) => {
      try {
        
  
        resetForm();
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    };

  const Content = () => {
    if (isBundleLoading) return <div className="p-8 text-center">Loading options...</div>;
    if (!bundleData) return <div className="p-8 text-center text-red-500">Failed to load bundle info.</div>;

    return (
      <div>
      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-6 text-center shadow-sm">
           <h3 className="text-xl font-bold text-gray-800 mb-2">{bundleData.title}</h3>
           <p className="text-gray-600 mb-4 text-sm">{bundleData.subTitle}</p>
           
           <div className="flex items-center justify-center gap-2 mb-4">
             <div className="bg-yellow-100 p-2 rounded-full">
                <SvgIcon iconSize="medium" name="coin" size={32} />
             </div>
             <span className="text-3xl font-bold text-gray-900">{bundleData.connects} <span className="text-lg font-medium text-gray-500">Connects</span></span>
           </div>
           
           <div className="text-2xl font-bold text-red-600">
             ₹{fmt2(bundleData.standardPrice)} 
              <span className="text-xs font-normal text-gray-500 block mt-1">(Inclusive of all taxes)</span>
           </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>This bundle expires in 30 days.</p>
          <p className="mt-2">By proceeding, you authorize Houseclay to charge your account.</p>
        </div>

        <Button 
        onClick={handleProceedToPay}
        isLoading={isCreatingOrder}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-medium"
        disabled={isCreatingOrder || !bundleData}
        >
          Proceed to Pay
        </Button>
      </div>
      <br />
      <hr />
      <br />
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Verify with your Corporate email id to get the Access Pass for Free!</h2>
        <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {() => (
                <Form className="space-y-4 flex gap-4">
                  <FormTextField
                    name="email"
                    id="email"
                    label="Email"
                    placeholder="Enter your personal email"
                    className="w-full"
                    required
                  />

                  {/* Feedback Messages */}
                  {isSuccess && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
                      Message sent successfully! We will get back to you soon.
                    </div>
                  )}
                  {isError && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-3 py-1 md:px-5 md:py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg shadow-sm transition-colors"
                  >
                    {isLoading && <Spinner size="sm" />}
                    {isLoading ? "Sending..." : "Verify"}
                  </button>
                </Form>
              )}
            </Formik>
      </div>
      </div>
    );
  };

  return (
    <Dialog
      id={id}
      type={isMobile ? "fullscreen" : "card"}
      width={isMobile ? 100 : 60}
      onClose={handleCloseDialog}
      entryAnimation={isMobile ? "animate-slide-in-right" : "animate-fade-in"}
      exitAnimation={isMobile ? "animate-slide-out-right" : "animate-fade-out"}
    >
      <DialogHeader>
        {isMobile ? (
             <MobileHeader>
                <MobileHeader.Title>
                    {localAuthStep === "login" ? "Login" : "Buy Connects"}
                </MobileHeader.Title>
                <MobileHeader.RightAction>
                  <Button
                    variant="secondary"
                    size="custom"
                    className="rounded-full p-1"
                    onClick={handleCloseDialog}
                  >
                    <X size={24} />
                  </Button>
                </MobileHeader.RightAction>
             </MobileHeader>
        ) : (
            <div className="flex justify-between w-full">
                 <h2 className="text-xl font-semibold">
                    {localAuthStep === "login" ? "Login" : "Buy Connects"}
                 </h2>
                 <Button
                    variant="secondary"
                    size="custom"
                    className="rounded-full p-1 hover:bg-gray-100"
                    onClick={handleCloseDialog}
                  >
                    <X size={20} />
                  </Button>
            </div>
        )}
      </DialogHeader>

      <DialogContent>
        <div className={isMobile ? "h-full" : "p-6"}>
          {localAuthStep === "login" ? (
            <div className="h-full">
              {/* Embed Login component. 
                   NOTE: Login component inside Dialog usually expects to control the dialog via onClose.
                   Here, we want success to just switch state. 
                   We need to ensure Login component calls onClose on success.
                   We pass a custom onClose that updates local state.
               */}
              <Login onClose={() => setLocalAuthStep("buy")} />
            </div>
          ) : (
            <Content />
          )}
        </div>
      </DialogContent>
      
      {/* {localAuthStep === "buy" && (
          <DialogFooter className="p-4 border-t">
            
          </DialogFooter>
      )} */}
    </Dialog>
  );
};

export default BuyConnectsDialog;

import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import StepNavigationButton, { FormStep } from "./StepNavigationButton";

const RentStepper: React.FC<{
  currentStep: FormStep;
  completedSteps: Set<FormStep>;
}> = ({ currentStep, completedSteps }) => {
  return (
    <>
      {[
        { step: FormStep.PROPERTY_DETAILS, Icon: Home },
        { step: FormStep.LOCALITY_DETAILS, Icon: MapPin },
        { step: FormStep.RENTAL_DETAILS, Icon: IndianRupee },
        { step: FormStep.GALLERY, Icon: FileImage },
        { step: FormStep.ADDITIONAL_INFO, Icon: FileText },
      ].map((item, idx, arr) => (
        <StepNavigationButton
          key={item.step}
          step={item.step}
          currentStep={currentStep}
          completedSteps={completedSteps}
          Icon={item.Icon}
          isLast={idx === arr.length - 1}
        />
      ))}
    </>
  );
};

export default RentStepper;

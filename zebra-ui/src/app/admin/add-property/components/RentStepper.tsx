import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import { ListPropertyFormStep as AddPropertyFormStep } from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

const RentStepper: React.FC<{
  currentStep: AddPropertyFormStep;
  completedSteps: Set<AddPropertyFormStep>;
}> = ({ currentStep, completedSteps }) => {
  return (
    <>
      {[
        { step: AddPropertyFormStep.PROPERTY_DETAILS, Icon: Home },
        { step: AddPropertyFormStep.LOCALITY_DETAILS, Icon: MapPin },
        { step: AddPropertyFormStep.RENTAL_DETAILS, Icon: IndianRupee },
        { step: AddPropertyFormStep.GALLERY, Icon: FileImage },
        { step: AddPropertyFormStep.ADDITIONAL_INFO, Icon: FileText },
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

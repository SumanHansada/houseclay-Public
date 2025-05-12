import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import { ListPropertyFormStep } from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

const FlatmatesStepper: React.FC<{
  currentStep: ListPropertyFormStep;
  completedSteps: Set<ListPropertyFormStep>;
}> = ({ currentStep, completedSteps }) => {
  return (
    <>
      {[
        { step: ListPropertyFormStep.PROPERTY_DETAILS, Icon: Home },
        { step: ListPropertyFormStep.LOCALITY_DETAILS, Icon: MapPin },
        { step: ListPropertyFormStep.RENTAL_DETAILS, Icon: IndianRupee },
        { step: ListPropertyFormStep.GALLERY, Icon: FileImage },
        { step: ListPropertyFormStep.ADDITIONAL_INFO, Icon: FileText },
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

export default FlatmatesStepper;

import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import {
  ListPropertyFormStep as AddPropertyFormStep,
  PropertyType,
} from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

interface DesktopStepperProps {
  currentStep: AddPropertyFormStep;
  completedSteps: Set<AddPropertyFormStep>;
  type: PropertyType;
}

const DesktopStepper: React.FC<DesktopStepperProps> = ({
  currentStep,
  completedSteps,
  type,
}) => {
  const getSteps = () => {
    const baseSteps = [
      { step: AddPropertyFormStep.PROPERTY_DETAILS, Icon: Home },
      { step: AddPropertyFormStep.LOCALITY_DETAILS, Icon: MapPin },
      { step: AddPropertyFormStep.GALLERY, Icon: FileImage },
      { step: AddPropertyFormStep.ADDITIONAL_INFO, Icon: FileText },
    ];
    const middleStep = {
      step:
        type === PropertyType.RESALE
          ? AddPropertyFormStep.RESALE_DETAILS
          : AddPropertyFormStep.RENTAL_DETAILS,
      Icon: IndianRupee,
    };
    return [...baseSteps.slice(0, 2), middleStep, ...baseSteps.slice(2)];
  };
  const steps = getSteps();

  return (
    <div className="flex">
      {steps.map((item, idx, arr) => (
        <StepNavigationButton
          key={item.step}
          step={item.step}
          currentStep={currentStep}
          completedSteps={completedSteps}
          Icon={item.Icon}
          isLast={idx === arr.length - 1}
        />
      ))}
    </div>
  );
};

export default DesktopStepper;

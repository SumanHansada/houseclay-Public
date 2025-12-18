import { X } from "lucide-react";

import { Button } from "@/base-components";
import { ListPropertyFormStep, PropertyCategory } from "@/common/enums";
import { MobileHeader } from "@/layout-components";

interface EditPropertyMobileStepperProps {
  currentStep: ListPropertyFormStep;
  propertyCategory: PropertyCategory;
  onClose: () => void;
}

const EditPropertyMobileStepper: React.FC<EditPropertyMobileStepperProps> = ({
  currentStep,
  propertyCategory,
  onClose,
}) => {
  const getStepsForPropertyType = (): string[] => {
    const baseSteps = [
      ListPropertyFormStep.PROPERTY_DETAILS,
      ListPropertyFormStep.LOCALITY_DETAILS,
      ListPropertyFormStep.GALLERY,
      ListPropertyFormStep.ADDITIONAL_INFO,
      ListPropertyFormStep.DONE,
    ];

    if (
      propertyCategory === PropertyCategory.RENT ||
      propertyCategory === PropertyCategory.FLATMATE
    ) {
      return [
        ...baseSteps.slice(0, 2),
        ListPropertyFormStep.RENTAL_DETAILS,
        ...baseSteps.slice(2),
      ];
    } else if (propertyCategory === PropertyCategory.RESALE) {
      return [
        ...baseSteps.slice(0, 2),
        ListPropertyFormStep.RESALE_DETAILS,
        ...baseSteps.slice(2),
      ];
    }
    return baseSteps;
  };

  const calculateProgressPercent = (): number => {
    const steps = getStepsForPropertyType();
    const currentIndex = steps.findIndex((step) => step === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const stepsForType = getStepsForPropertyType();
  const currentIndex = stepsForType.findIndex((step) => step === currentStep);

  const displayStep =
    typeof currentStep === "string"
      ? currentStep
      : currentStep === ListPropertyFormStep.DONE
        ? stepsForType[stepsForType.length - 1]
        : stepsForType[currentIndex] || stepsForType[0];

  return (
    <>
      <MobileHeader>
        <MobileHeader.Title>{displayStep}</MobileHeader.Title>
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
      <div className="h-[2px] fixed top-14 w-full bg-gray-200 mt-auto z-50 md:hidden">
        <div
          className="h-[2px] bg-red-500 absolute top-0 left-0 transition-all duration-300"
          style={{ width: `${calculateProgressPercent()}%` }}
        />
      </div>
    </>
  );
};

export default EditPropertyMobileStepper;

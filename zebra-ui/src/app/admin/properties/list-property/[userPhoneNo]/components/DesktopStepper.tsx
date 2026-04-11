import {
  FileImage,
  FileText,
  Home,
  IndianRupee,
  MapPin,
  X,
} from "lucide-react";

import {
  ListPropertyFormStep as AddPropertyFormStep,
  PropertyCategory,
} from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

interface DesktopStepperProps {
  currentStep: AddPropertyFormStep;
  completedSteps: Set<AddPropertyFormStep>;
  propertyCategory: PropertyCategory;
  isMobile: boolean;
  onGoToHome: () => void;
}

const DesktopStepper: React.FC<DesktopStepperProps> = ({
  currentStep,
  completedSteps,
  propertyCategory,
  isMobile,
  onGoToHome,
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
        propertyCategory === PropertyCategory.RESALE
          ? AddPropertyFormStep.RESALE_DETAILS
          : AddPropertyFormStep.RENTAL_DETAILS,
      Icon: IndianRupee,
    };
    return [...baseSteps.slice(0, 2), middleStep, ...baseSteps.slice(2)];
  };

  const getStepsForPropertyType = (): string[] => {
    const baseSteps = [
      AddPropertyFormStep.PROPERTY_DETAILS,
      AddPropertyFormStep.LOCALITY_DETAILS,
      AddPropertyFormStep.GALLERY,
      AddPropertyFormStep.ADDITIONAL_INFO,
      AddPropertyFormStep.DONE,
    ];

    if (
      propertyCategory === PropertyCategory.RENT ||
      propertyCategory === PropertyCategory.FLATMATE
    ) {
      return [
        ...baseSteps.slice(0, 2),
        AddPropertyFormStep.RENTAL_DETAILS,
        ...baseSteps.slice(2),
      ];
    } else if (propertyCategory === PropertyCategory.RESALE) {
      return [
        ...baseSteps.slice(0, 2),
        AddPropertyFormStep.RESALE_DETAILS,
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

  const steps = getSteps();

  // Mobile stepper
  if (isMobile) {
    const stepsForType = getStepsForPropertyType();
    const currentIndex = stepsForType.findIndex((step) => step === currentStep);

    const displayStep =
      typeof currentStep === "string"
        ? currentStep
        : currentStep === AddPropertyFormStep.DONE
          ? stepsForType[stepsForType.length - 1]
          : stepsForType[currentIndex] || stepsForType[0];

    return (
      <>
        <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 h-14 border-b border-gray-200 shadow-sm bg-white flex flex-col justify-center items-center w-full md:hidden">
          <div className="flex justify-center items-center align-middle w-full md:hidden">
            <h1 className="text-lg my-auto text-black ml-auto">
              {displayStep}
            </h1>
            <button className="border border-gray-200 rounded-full md:border-none ml-auto">
              <X onClick={onGoToHome} size={25} />
            </button>
          </div>
        </section>
        <div className="h-[2px] fixed w-full bg-gray-200 mt-auto z-50">
          <div
            className="h-[2px] bg-red-500 absolute top-0 left-0 transition-all duration-300"
            style={{ width: `${calculateProgressPercent()}%` }}
          />
        </div>
      </>
    );
  }

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

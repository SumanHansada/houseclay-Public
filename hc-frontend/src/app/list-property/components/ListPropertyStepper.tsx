import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import { ListPropertyFormStep, PropertyCategory } from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

interface ListPropertyStepperProps {
  currentStep: ListPropertyFormStep;
  completedSteps: Set<ListPropertyFormStep>;
  propertyCategory: PropertyCategory;
  isMobile: boolean;
  onGoToHome: () => void;
}

const ListPropertyStepper: React.FC<ListPropertyStepperProps> = ({
  currentStep,
  completedSteps,
  propertyCategory,
  isMobile,
  onGoToHome,
}) => {
  const getSteps = () => {
    const baseSteps = [
      { step: ListPropertyFormStep.PROPERTY_DETAILS, Icon: Home },
      { step: ListPropertyFormStep.LOCALITY_DETAILS, Icon: MapPin },
      { step: ListPropertyFormStep.GALLERY, Icon: FileImage },
      { step: ListPropertyFormStep.ADDITIONAL_INFO, Icon: FileText },
    ];

    const middleStep = {
      step:
        propertyCategory === PropertyCategory.RESALE
          ? ListPropertyFormStep.RESALE_DETAILS
          : ListPropertyFormStep.RENTAL_DETAILS,
      Icon: IndianRupee,
    };

    return [...baseSteps.slice(0, 2), middleStep, ...baseSteps.slice(2)];
  };

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

  const steps = getSteps();

  // Mobile stepper
  if (isMobile) {
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
        <section className="py-2 px-4 fixed top-0 left-0 right-0 z-50 h-[55px] border-gray-200 bg-white flex flex-col justify-center items-center w-full md:hidden">
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

  // Desktop stepper
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.4,
          },
        },
      }}
    >
      {steps.map((item, idx, arr) => (
        <motion.div
          key={item.step}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <StepNavigationButton
            step={item.step}
            currentStep={currentStep}
            completedSteps={completedSteps}
            Icon={item.Icon}
            isLast={idx === arr.length - 1}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ListPropertyStepper;

import { motion } from "framer-motion";
import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import { ListPropertyFormStep, PropertyCategory } from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

interface ListPropertyDesktopStepperProps {
  currentStep: ListPropertyFormStep;
  completedSteps: Set<ListPropertyFormStep>;
  propertyCategory: PropertyCategory;
}

const ListPropertyDesktopStepper: React.FC<ListPropertyDesktopStepperProps> = ({
  currentStep,
  completedSteps,
  propertyCategory,
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

  const steps = getSteps();

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

export default ListPropertyDesktopStepper;

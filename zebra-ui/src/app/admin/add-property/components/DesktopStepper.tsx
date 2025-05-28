import { motion } from "framer-motion";
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
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex"
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
          className="flex-1"
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

export default DesktopStepper;

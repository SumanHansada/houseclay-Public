import { motion } from "framer-motion";
import { FileImage, FileText, Home, IndianRupee, MapPin } from "lucide-react";

import { ListPropertyFormStep } from "@/common/enums";

import StepNavigationButton from "./StepNavigationButton";

const RentStepper: React.FC<{
  currentStep: ListPropertyFormStep;
  completedSteps: Set<ListPropertyFormStep>;
}> = ({ currentStep, completedSteps }) => {
  const steps = [
    { step: ListPropertyFormStep.PROPERTY_DETAILS, Icon: Home },
    { step: ListPropertyFormStep.LOCALITY_DETAILS, Icon: MapPin },
    { step: ListPropertyFormStep.RENTAL_DETAILS, Icon: IndianRupee },
    { step: ListPropertyFormStep.GALLERY, Icon: FileImage },
    { step: ListPropertyFormStep.ADDITIONAL_INFO, Icon: FileText },
  ];

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

export default RentStepper;

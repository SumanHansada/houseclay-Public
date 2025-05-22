import { Check } from "lucide-react";

import { ListPropertyFormStep as AddPropertyFormStep } from "@/common/enums";

interface StepNavProps {
  step: AddPropertyFormStep;
  currentStep: AddPropertyFormStep;
  completedSteps: Set<AddPropertyFormStep>;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isLast?: boolean;
}

const StepNavigationButton: React.FC<StepNavProps> = ({
  step,
  currentStep,
  completedSteps,
  Icon,
  isLast = false,
}) => {
  const isActive = currentStep === step;
  const isCompleted = completedSteps.has(step);

  return (
    <div className="relative flex flex-col items-center flex-1">
      {/* Icon */}
      <div
        className={`
          w-10 h-10 rounded-full border-2 flex items-center justify-center
          ${isCompleted ? "border-green-500" : isActive ? "border-red-500" : "border-gray-300"}
          bg-white dark:bg-gray-900 z-10
        `}
      >
        {isCompleted ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Icon
            className={`w-5 h-5 ${
              isActive ? "text-red-500" : "text-gray-500 dark:text-gray-300"
            }`}
          />
        )}
      </div>

      {/* Connector line */}
      {!isLast && (
        <div
          className={`
            absolute xl:top-1/3 lg:top-[28%] top-1/4 left-1/2
            w-full h-[3px] -translate-y-1/2
            ${isCompleted ? "bg-green-500" : "bg-gray-300"}
          `}
        />
      )}

      {/* Label */}
      <span
        className={`mt-2 text-sm ${
          isActive ? "text-red-500" : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {step}
      </span>
    </div>
  );
};

export default StepNavigationButton;

import { Check } from "lucide-react";

export enum FormStep {
  GETTING_STARTED = "Getting Started",
  PROPERTY_DETAILS = "Property Details",
  LOCALITY_DETAILS = "Locality Details",
  RENTAL_DETAILS = "Rental Details",
  RESALE_DETAILS = "Resale Details",
  GALLERY = "Gallery",
  ADDITIONAL_INFO = "Additional Information",
  DONE = "Done",
}

const StepNavigationButton: React.FC<{
  step: FormStep;
  currentStep: FormStep;
  completedSteps: Set<FormStep>;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isLast?: boolean;
}> = ({ step, currentStep, completedSteps, Icon, isLast }) => {
  const isActive = currentStep === step;
  const isCompleted = completedSteps.size > 0 && completedSteps.has(step);

  return (
    <div className="relative flex flex-col items-start">
      <div className="flex flex-row items-start">
        {/* Icon + line column */}
        <div className="relative flex flex-col items-center">
          <div
            className={`p-2 rounded-full border flex items-center justify-center 
                      ${isCompleted ? "border-green-500" : isActive ? "border-red-500" : "border-black"}`}
          >
            {isCompleted ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Icon
                className={`w-5 h-5 ${isActive ? "text-red-500" : "text-black"}`}
              />
            )}
          </div>
          {/* Vertical line below the circle */}
          {!isLast && (
            <div
              className={`w-px h-8  ${isCompleted ? "bg-black" : "bg-gray-300"}`}
            />
          )}
        </div>

        {/* Step label */}
        <div className="pl-2 pt-2">
          <span className={`${isActive ? "text-red-500" : "text-gray-600"}`}>
            {step}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepNavigationButton;

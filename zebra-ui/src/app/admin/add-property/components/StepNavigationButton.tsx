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
      {/* Icon + connector */}
      <div className="relative">
        <div
          className={`
            size-10 rounded-full border-[3px] flex items-center justify-center
            ${isCompleted ? "border-green-500" : isActive ? "border-red-500" : "border-gray-300"}
          `}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Icon
              className={`w-5 h-5 ${isActive ? "text-red-500" : "text-gray-500 dark:text-gray-300"}`}
            />
          )}
        </div>

        {/* horizontal line to next step */}
        {!isLast && (
          <div
            className={`
              absolute top-1/2 left-10
              h-[3px]
              w-56
              ${isCompleted ? "bg-green-500" : "bg-gray-300"}
            `}
          />
        )}
      </div>

      {/* Label, centered */}
      <span
        className={`mt-2 ${isActive ? "text-red-500" : "text-gray-600 dark:text-gray-300"}`}
      >
        {step}
      </span>
    </div>
  );
};

export default StepNavigationButton;

// import { Check } from "lucide-react";

// import { ListPropertyFormStep as AddPropertyFormStep } from "@/common/enums";

// const StepNavigationButton: React.FC<{
//   step: AddPropertyFormStep;
//   currentStep: AddPropertyFormStep;
//   completedSteps: Set<AddPropertyFormStep>;
//   Icon: React.FC<React.SVGProps<SVGSVGElement>>;
//   isLast?: boolean;
// }> = ({ step, currentStep, completedSteps, Icon, isLast }) => {
//   const isActive = currentStep === step;
//   const isCompleted = completedSteps.size > 0 && completedSteps.has(step);

//   return (
//     <div className="relative flex items-start">
//       <div className="flex flex-col items-start">
//         {/* Icon + line column */}
//         <div className="relative flex items-center">
//           <div
//             className={`p-2 ml-8 rounded-full border flex items-center justify-center
//                       ${isCompleted ? "border-green-500" : isActive ? "border-red-500" : "border-black"}`}
//           >
//             {isCompleted ? (
//               <Check className="w-5 h-5 text-green-500" />
//             ) : (
//               <Icon
//                 className={`w-5 h-5 ${isActive ? "text-red-500" : "text-black"}`}
//               />
//             )}
//           </div>

//           {/* Vertical line below the circle */}
//           {!isLast && (
//             <div
//               className={`w-32 h-px  ${isCompleted ? "bg-black" : "bg-gray-300"}`}
//             />
//           )}
//         </div>

//         {/* Step label */}
//         <div className="pt-2">
//           <span className={`${isActive ? "text-red-500" : "text-gray-600"}`}>
//             {step}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StepNavigationButton;

{
  /* <div className="relative flex items-start">
      <div className="flex flex-col items-start">
        <div className="relative flex">
          <div>
            <div
              className={`size-12 mx-auto rounded-full border flex items-center justify-center 
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

            <div className="pt-2 px-2">
              <span
                className={`${isActive ? "text-red-500" : "text-gray-600"}`}
              >
                {step}
              </span>
            </div>
          </div>

          {!isLast && (
            <div
              className={`w-40 h-[1.5px] mt-6  ${isCompleted ? "bg-black" : "bg-gray-300"}`}
            />
          )}
        </div>
      </div>
</div> */
}

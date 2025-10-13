import React from 'react';
import Image from "next/image";

export interface LeadWorkflowStepperProps {
  currentStatus: string;
}

export interface LeadStep {
  label: string;
  value: string;
  status: 'completed' | 'current' | 'pending';
}

const leadSteps: LeadStep[] = [
  { label: "ایجاد شده", value: "INITIAL", status: 'completed' },
  { label: "در جریان", value: "INPROGRESS", status: 'current' },
  { label: "تبدیل به قرارداد", value: "CONTRACTED", status: 'pending' },
  { label: "از دست رفته", value: "FAILED", status: 'pending' },
];

export default function LeadWorkflowStepper({ currentStatus }: LeadWorkflowStepperProps) {
  // Determine the current step index based on status
  const getCurrentStepIndex = (status: string) => {
    return leadSteps.findIndex(step => step.value === status);
  };

  const currentStepIndex = getCurrentStepIndex(currentStatus);

  return (
    <div className="flex flex-col w-full gap-3 lg:gap-4 p-3 lg:p-6">
      <div className="flex items-center justify-between w-full overflow-x-auto">
        {leadSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <React.Fragment key={step.value}>
              <div
                className={`flex flex-col items-center gap-1 lg:gap-2 min-w-0 flex-shrink-0 ${isCurrent ? "cursor-pointer" : ""
                  }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${isCurrent
                    ? "border-[#1C68DA] bg-white"
                    : isCompleted
                      ? "border-[#1C284F] bg-[#1C284F]"
                      : "border-gray-300 bg-white"
                    }`}
                >
                  {isCompleted ? (
                    <Image
                      src={"/icons/tick-icon.png"}
                      alt="completed"
                      width={1024}
                      height={1024}
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3"
                    />
                  ) : (
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2 lg:h-2 rounded-full ${isCurrent ? "bg-[#1C68DA]" : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>
              </div>

              {index < leadSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-[15px] transition-all duration-200 ${isCompleted ? "bg-[#1C284F]" : "bg-gray-300"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="w-full flex justify-between px-1 sm:px-2">
        {leadSteps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          return (
            <div
              key={index}
              className={`text-center text-xs sm:text-sm font-medium transition-colors duration-200 max-w-[60px] sm:max-w-[80px] lg:max-w-none truncate ${isCurrent
                ? "text-[#1C68DA]"
                : index < currentStepIndex
                  ? "text-[#1C284F]"
                  : "text-gray-400"
                }`}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
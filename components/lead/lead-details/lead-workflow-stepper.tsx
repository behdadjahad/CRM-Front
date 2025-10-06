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
    <div className="flex flex-col w-full gap-4 p-6">
      <div className="flex items-center justify-between w-full">
        {leadSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <React.Fragment key={step.value}>
              <div
                className={`flex flex-col items-center gap-2 ${isCurrent ? "cursor-pointer" : ""
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${isCurrent
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
                      className="w-3 h-3"
                    />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full ${isCurrent ? "bg-[#1C68DA]" : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>
              </div>

              {index < leadSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all duration-200 ${isCompleted ? "bg-[#1C284F]" : "bg-gray-300"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="w-full flex justify-between px-2">
        {leadSteps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          return (
            <div
              key={index}
              className={`text-center text-sm font-medium transition-colors duration-200 ${isCurrent
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
import Image from "next/image";
import { useRouter } from "next/navigation";
export interface RegistrationProgressInterface {
  doneStep: number;
  steps: {
    label: string;
    value: number;
  }[];
}

export default function RegistrationProgress({
  doneStep,
  steps,
}: RegistrationProgressInterface) {
  const router = useRouter();
  return (
    <div className="flex flex-col w-2/3 gap-4">
      <div className="flex items-center justify-between w-full px-8">
        {steps.map((step, index) => (
          <>
            <div
              key={step.label}
              className={` ${
                step.value == doneStep + 1
                  ? "bg-card rounded-full w-8 h-8 flex items-center justify-center  border-2 border-[#1C68DA]"
                  : ""
              } ${doneStep === 1 && step.value == 2 ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (doneStep === 1 && step.value == 2) {
                  router.push("/register");
                }
              }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold
              ${
                step.value <= doneStep + 1
                  ? "bg-[#1C284F]"
                  : "bg-card border border-gray-300"
              }
            `}
              >
                {step.value <= doneStep ? (
                  <Image
                    src={"/icons/tick-icon.png"}
                    alt="tick"
                    width={1024}
                    height={1024}
                    className="w-3 h-3"
                  />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full  ${
                      doneStep + 1 == step.value
                        ? "bg-card"
                        : "bg-gray-300 border border-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 w-24
            ${doneStep > step.value ? "bg-[#1C284F]" : "bg-gray-300"}
          `}
              />
            )}
          </>
        ))}
      </div>
      <div className="w-full flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

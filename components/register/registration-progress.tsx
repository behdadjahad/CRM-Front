import Image from "next/image";
export interface RegistrationProgressInterface {
  currentStep: number;
}

export default function RegistrationProgress({
  currentStep,
}: RegistrationProgressInterface) {
  const steps = [1, 2, 3];
  return (
    <div className="flex flex-col w-2/3 gap-4">
      <div className="flex items-center justify-between w-full px-8">
        {steps.map((step, index) => (
          <>
            <div
              key={step}
              className={` ${
                currentStep == step
                  ? "bg-card rounded-full w-8 h-8 flex items-center justify-center  border-2 border-[#1C68DA]"
                  : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold
              ${
                currentStep >= step
                  ? "bg-[#1C284F]"
                  : "bg-card border border-gray-300"
              }
            `}
              >
                {index + 1 < currentStep ? (
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
                      currentStep == step
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
            ${currentStep > step ? "bg-[#1C284F]" : "bg-gray-300"}
          `}
              />
            )}
          </>
        ))}
      </div>
      <div className="w-full flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            تایید کارشناسان
          </div>
        ))}
      </div>
    </div>
    //     <div className="flex items-center justify-center w-full max-w-md mx-auto">
    //       {steps.map((step, index) => (
    //         <div key={step} className="flex flex-col gap-4 items-first">
    //               <div className="flex items-center justify-center ">
    //                   <div className=" pr-8">

    //             <div
    //               className={` ${
    //                 currentStep == step
    //                   ? "bg-card rounded-full w-10 h-10 flex items-center justify-center  border-2 border-[#1C68DA]"
    //                   : ""
    //               }`}
    //             >
    //               <div
    //                 className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
    //               ${
    //                 currentStep >= step
    //                   ? "bg-[#1C284F]"
    //                   : "bg-card border border-gray-300"
    //               }
    //             `}
    //               >
    //                 {" "}
    //               </div>
    //          </div>
    // </div>
    //             {index < steps.length - 1 ? (
    //               <div className="w-80 h-0.5 bg-red-600" />
    //             ) : (
    //               <div className="w-72" />
    //             )}
    //           </div>
    //           <span className="ml-4">تایید کارشناسان</span>
    //         </div>
    // <div key={step} className="flex items-center  justify-center bg-red-400">
    //   {/* Dot */}
    //   <div className="flex flex-col items-center justify-between gap-2">
    //     <div
    //       className={`${
    //         currentStep == step
    //           ? "bg-card rounded-full w-10 h-10 flex items-center justify-center  border-2 border-[#1C68DA]"
    //           : ""
    //       }`}
    //     >
    //       <div
    //         className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
    //       ${
    //         currentStep >= step
    //           ? "bg-[#1C284F]"
    //           : "bg-card border border-gray-300"
    //       }
    //     `}
    //       >
    //         {index + 1 < currentStep ? (
    //           <Image
    //             src={"/icons/tick-icon.png"}
    //             alt="tick"
    //             width={1024}
    //             height={1024}
    //             className="w-3 h-3"
    //           />
    //         ) : (
    //           <div
    //             className={`w-2 h-2 rounded-full  ${
    //               currentStep == step
    //                 ? "bg-card"
    //                 : "bg-gray-300 border border-gray-300"
    //             }`}
    //           ></div>
    //         )}
    //       </div>
    //     </div>

    //     <span>تایید کارشناسان</span>
    //       </div>
    //          {index < steps.length - 1 && (
    //       <div
    //         className={`h-0.5 w-24
    //         ${currentStep > step ? "bg-[#1C284F]" : "bg-gray-300"}
    //       `}
    //       />
    //     )}
    // </div>
    //   ))}
    // </div>
  );
}

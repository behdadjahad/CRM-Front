"use client";

import RegistrationProgress from "@/components/register/registration-progress";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PendingRegister() {
  const [currentStep, setCurrentStep] = useState<number>(2);

  const router = useRouter();
  const steps = [
    {
      label: "ثبت نام اولیه",
      value: 1,
    },
    {
      label: "تکمیل مشخصات و ارسال مدارک",
      value: 2,
    },
    {
      label: "تایید مدارک",
      value: 3,
    },
  ];
  const userData = useSelector((state: RootState) => state.user);
  useEffect(() => {
    switch (userData?.status) {
      case "initial":
        setCurrentStep(2);
        break;
      case "pending":
        setCurrentStep(3);
        break;

      default:
        return;
    }
  }, [userData?.status]);
  return (
    <main>
      <div className="bg-card rounded-lg w-full flex justify-between items-center p-6 flex-col gap-4 h-64">
        <RegistrationProgress currentStep={currentStep} steps={steps} />
        <div className="flex flex-col gap-4 items-center">
          {currentStep === 2 ? (
            <p className="text-center text-base text-tertiary-background">
              {" "}
              کاربر گرامی لطفا جهت استفاده از امکانات پنل مدیریت مشتریان چادکو
              نسبت به تکمیل فرم ثبت نام خود اقدام نمایید.
            </p>
          ) : currentStep === 3 ? (
            <p className="text-center text-base text-tertiary-background">
              {" "}
              کاربر گرامی لطفا تا زمان تایید مدارک شما توسط کارشناسان منتظر بمانید.
            </p>
          ) : (
            <></>
          )}

          {currentStep === 2 && (
            <Button variant={"info"} onClick={() => router.push("/register")}>
              تکمیل فرم ثبت نام
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

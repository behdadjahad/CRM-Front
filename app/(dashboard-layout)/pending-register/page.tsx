import RegistrationProgress from "@/components/register/registration-progress";
import { Button } from "@/components/ui/button";

export default function PendingRegister() {
  return (
    <main>
      <div className="bg-card rounded-lg w-full flex justify-between items-center p-6 flex-col gap-4 h-64">
              <RegistrationProgress currentStep={2} />
              <div className="flex flex-col gap-4 items-center">
        <p className="text-center text-base text-tertiary-background">
          کاربر گرامی لطفا جهت استفاده از امکانات پنل مدیریت مشتریان چادکو نسبت
          به تکمیل فرم ثبت نام خود اقدام نمایید.
        </p>
        <Button variant={"info"}>تکمیل فرم ثبت نام</Button>
              </div>
              </div>
    </main>
  );
}

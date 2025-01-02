import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import Link from "next/link";
import { StageInterface } from "@/app/(login-layout)/login/page";
import { useState, useEffect } from "react";

export default function VerificationForm({
  stageHandler,
  formik,
}: StageInterface) {
  const [count, setCount] = useState(120);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(count / 60);
  const seconds = count % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  function verificationHandler() {
    console.log(formik.values);
  }

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-tertiary">
        تایید کد
      </h1>
      <p className="text-center text-base text-tertiary-background">
        ما یک کد تأیید 6 رقمی را به <span>chadko@gmail.com</span> ارسال
        کرده‌ایم، لطفاً کد را در کادر زیر وارد کنید.
      </p>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "verification",
            component: "verification",
            maxLength: 6,
          },
        ]}
      />

      {count > 0 && (
        <p className="text-blue-800">
          <span>{minutes}</span>:<span>{formattedSeconds}</span>
          <span className="text-quartiery-foreground">تا ارسال مجدد کد</span>
        </p>
      )}

      <Button
        type="submit"
        variant={"foreground"}
        className="w-full bg-quartiery-background m-2 text-tertiary-foreground"
        onClick={verificationHandler}
      >
        ثبت
      </Button>

      <Link
        href=""
        className="text-center text-tertiary-foreground text-sm"
        legacyBehavior
      >
        <a
          onClick={() => {
            stageHandler("reset");
          }}
        >
          بازگشت
        </a>
      </Link>
    </div>
  );
}

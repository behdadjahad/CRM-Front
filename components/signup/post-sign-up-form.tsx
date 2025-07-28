"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function PostSignUpForm() {
  const router = useRouter();
  function skipSignUpHandler() {
    router.push("/sale");
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-tertiary">
        تکمیل ثبت نام حساب
      </h1>

      <p className="text-center text-base text-tertiary-background">
        آیا مایل هستید همین الان فرم ثبت نام خود را تکمیل کنید؟
      </p>
      <div className="flex flex-col gap-4">
        <Button variant={"info"} onClick={() => {}}>
          تکمیل ثبت نام{" "}
        </Button>
        <Button
          variant={"foreground"}
          onClick={() => {
            skipSignUpHandler();
          }}
        >
          بعدا تکمیل می کنم !
        </Button>
      </div>
    </div>
  );
}

import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import Link from "next/link";
import { forgetPassword } from "@/api/auth";
import { StageInterface } from "@/types/globals";

export default function UserRecoveryForm({
  stageHandler,
  formik,
}: StageInterface) {
  function forgotPasswordHandler() {
    stageHandler("user-verification");
    forgetPassword({ identifier: formik.values["resetEmail"] });
  }
  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-tertiary">
        بازیابی رمز عبور
      </h1>
      <p className="text-center text-base text-tertiary-background">
        برای دریافت کد لطفا شماره همراه یا ایمیل خود را وارد کنید
      </p>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "resetEmail",
            component: "input",
            placeholder: "ایمیل یا شماره همراه",
            type: "email",
            floating: true,
            className: "w-full",
          },
        ]}
        className="flex flex-col w-full mt-8"
      />
      <Button
        type="submit"
        variant={"foreground"}
        className="bg-quartiery-background m-2 w-full text-tertiary-foreground"
        onClick={forgotPasswordHandler}
      >
        ارسال کد تایید
      </Button>
      <Link
        href="/login"
        className="text-center text-tertiary-foreground text-sm"
        legacyBehavior
      >
        بازگشت
      </Link>
    </div>
  );
}

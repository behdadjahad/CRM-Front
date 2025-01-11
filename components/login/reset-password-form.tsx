import Link from "next/link";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { resetPassword } from "@/api/auth";
import { StageInterface } from "@/types/globals";

export default function ResetPasswordForm({
  stageHandler,
  formik,
}: StageInterface) {
  function resetPasswordHandler() {
    if (
      formik.values["resetPassword"] === formik.values["retypeResetPassword"]
    ) {
      alert("true");
      resetPassword({
        resetCode: Number(formik.values["verification"].join("")),
        identifier: formik.values["resetEmail"],
        newPassword: formik.values["resetPassword"].toString(),
      });
    } else {
      alert("false");
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-tertiary">
        انتخاب رمزعبور
      </h1>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "info",
            component: "non-field",
            children: (
              <p className=" text-base text-tertiary-background w-full">
                لطفا رمز عبور جدید خودرا وارد کنید
              </p>
            ),
            className: "w-full text-right",
          },
          {
            key: "resetPassword",
            component: "input",
            placeholder: "رمزعبور",
            type: "password",
            floating: true,
            className: "m-0 w-full",
          },
          {
            key: "info",
            component: "non-field",
            children: (
              <p className=" text-base text-tertiary-background w-full">
                لطفا رمز عبور جدید خودرا مجددا وارد کنید
              </p>
            ),
            className: "w-full text-right",
          },
          {
            key: "retypeResetPassword",
            component: "input",
            placeholder: "رمزعبور",
            type: "password",
            floating: true,
            className: "m-0 w-full",
          },
        ]}
        className="flex flex-col w-full"
      />

      <Button
        type="submit"
        variant={"foreground"}
        className="bg-quartiery-background m-2 text-tertiary-foreground"
        onClick={resetPasswordHandler}
      >
        ورود
      </Button>
      <Link
        href=""
        className="text-center text-tertiary-foreground text-sm"
        legacyBehavior
      >
        <a
          onClick={() => {
            stageHandler("user-verification");
          }}
        >
          بازگشت
        </a>
      </Link>
    </div>
  );
}

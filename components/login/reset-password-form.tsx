import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { useState } from "react";
import { resetPassword } from "@/api/auth";
import { StageInterface } from "@/types/globals";

export default function RenewPasswordForm({
  stageHandler,
  formik,
}: StageInterface) {
  function resetPasswordHandler() {
    if (
      formik.values["resetPassword"] === formik.values["retypeResetPassword"]
    ) {
      alert("true");
      resetPassword({
        resetCode: formik.values["verification"].join(""),
        identifier: formik.values["resetEmail"],
        resetPassword: formik.values["resetPassword"],
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
      <p className="text-center text-base text-tertiary-background">
        لطفا رمز عبور جدید خودراوارد کنید
      </p>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "resetPassword",
            component: "input",
            placeholder: "رمزعبور",
            type: "password",
            floating: true,
            className: "m-0 w-full",
          },
        ]}
        className="flex flex-col w-full"
      />
      <p className="text-center text-base text-tertiary-background">
        لطفا رمز عبور جدید خودرا مجددا وارد کنید
      </p>

      <FormMaker
        form={formik}
        fields={[
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
    </div>
  );
}

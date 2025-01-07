"use client";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { REQUIRED_TEXT } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      resetEmail: "",
      verification: Array(6).fill(""),
      resetPassword: "",
      retypeResetPassword: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(REQUIRED_TEXT),
      password: Yup.string().required(REQUIRED_TEXT),
      resetEmail: Yup.string().required(REQUIRED_TEXT),
      resetPassword: Yup.string().required(REQUIRED_TEXT),
      retypeResetPassword: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: async () => {},
  });

  async function loginHandler() {
    const isValid = await formik.validateForm();
    if (!isValid) {
      // toast
      return;
    }

    const result = await login({
      usernameOrUniqueId: formik.values["email"],
      password: formik.values["password"],
    });

    if (result.success) {
      router.push("/sale");
      localStorage.setItem("token", result.data.accessToken);
    } else {
      // toast
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-tertiary">
        ورود به حساب
      </h1>

      <p className="text-center text-base text-tertiary-background">
        مشخصات خود را وارد کنید
      </p>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "email",
            component: "input",
            placeholder: "نام کاربری",
            type: "email",
            floating: true,
            className: "m-0 w-full",
          },
          {
            key: "password",
            component: "input",
            placeholder: "رمزعبور",
            type: "password",
            floating: true,
            className: "m-0 w-full",
          },
        ]}
        className="flex flex-col w-full"
      />

      <div className="flex items-center justify-between p-2">
        <Link href="/login/forget-password" className="text-quartiery text-sm">
          رمز عبور را فراموش کرده ام؟
        </Link>
        <div className="flex items-center gap-2">
          <label htmlFor="htmlFor" className="text-sm text-quartiery">
            به یاد داشته باش
          </label>
          <Checkbox className="border-input" />
        </div>
      </div>

      <Button
        type="submit"
        variant={"foreground"}
        className="bg-quartiery-background m-2 text-tertiary-foreground"
        onClick={loginHandler}
      >
        ورود
      </Button>
    </div>
  );
}

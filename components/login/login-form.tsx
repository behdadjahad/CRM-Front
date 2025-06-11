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
import { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(REQUIRED_TEXT),
      password: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: async () => {},
  });

  async function loginHandler() {
    // const isValid = await formik.validateForm();
    // if (!isValid) {
    //   // toast
    //   return;
    // }
    setIsLoading(true);
    const result = await login({
      usernameOrUniqueId: formik.values["email"],
      password: formik.values["password"],
    });

    if (result) {
 
      // Cookies.set("accessToken", result.data.accessToken, {
      //   path: "/",
      //   secure: true,
      //   sameSite: "Strict",
      //   expires: 1, // 1 hour
      // });

      // //Set refreshToken (still client-side!)
      // Cookies.set("refreshToken", result.data.refreshToken, {
      //   path: "/",
      //   secure: true,
      //   sameSite: "Strict",
      //   expires: 7, // 7 days
      // });
      if (result.status === "success") {
        router.push("/sale");
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
      }
    } else {
      // toast
      // router.push("/login");
    }
    setIsLoading(false);
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
            type: "text",
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
        className={`bg-quartiery-background m-2 text-tertiary-foreground ${
          isLoading ? "cursor-not-allowed" : ""
        }`}
        onClick={loginHandler}
      >
        {isLoading ? <div className="loader" /> : "ورود"}
      </Button>
    </div>
  );
}

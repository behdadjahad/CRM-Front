"use client";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";

import Link from "next/link";

import { useFormik } from "formik";
import * as Yup from "yup";
import { REQUIRED_TEXT } from "@/lib/utils";
import { useState } from "react";
import { SignUp, SignUpInput } from "@/api/signup";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const cityOptions = useSelector((state: any) => state.city.items);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      phoneNumber: "",
      email: "",
      city: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(REQUIRED_TEXT),
      lastName: Yup.string().required(REQUIRED_TEXT),
      companyName: Yup.string().required(REQUIRED_TEXT),
      phoneNumber: Yup.string().required(REQUIRED_TEXT),
      email: Yup.string().required(REQUIRED_TEXT),
      city: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: async () => {},
  });

  const { mutate: signUpHandler } = useMutation({
    mutationFn: (data: SignUpInput) => {
      return SignUp(data);
    },
    onSuccess: () => {},
  });

  function submitSignUp() {
    const data: SignUpInput = {
      registerationRequest: {
        companyName: formik.values.companyName,
      },
      user: {
        phoneNumber: formik.values.phoneNumber,
        email: formik.values.email,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        cityId: Number(formik.values.city),
      },
    };
    signUpHandler(data);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-tertiary">
        ثبت نام حساب
      </h1>

      <p className="text-center text-base text-tertiary-background">
        مشخصات خود را وارد کنید
      </p>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "firstName",
            component: "input",
            placeholder: "نام",
            type: "text",
            floating: true,
            className: "m-0 w-full lg:w-1/2",
          },
          {
            key: "lastName",
            component: "input",
            placeholder: "نام خانوادگی",
            type: "text",
            floating: true,
            className: "m-0 w-full lg:w-1/2",
          },
          {
            key: "city",
            component: "Select",
            placeholder: "شهر",
            type: "text",
            floating: true,
            className: "m-0 w-full lg:w-1/2",
            options: cityOptions,
          },
          {
            key: "companyName",
            component: "input",
            placeholder: "نام شرکت",
            type: "text",
            floating: true,
            className: "m-0 w-full lg:w-1/2",
          },
          {
            key: "email",
            component: "input",
            placeholder: "ایمیل",
            type: "email",
            floating: true,
            className: "m-0 w-full lg:w-1/2",
          },
          {
            key: "phoneNumber",
            component: "input",
            placeholder: "تلفن همراه",
            type: "text",
            floating: true,
            className: "m-0 w-full lg:w-1/2",
          },
        ]}
        className="flex flex-row w-full"
      />

      <div className="flex items-center justify-between p-2">
        <div className="text-quartiery text-sm">آیا حساب کاربری دارید؟</div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-quartiery">
            ورود به حساب
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant={"foreground"}
        className={`bg-quartiery-background m-2 text-tertiary-foreground ${
          isLoading ? "cursor-not-allowed" : ""
        }`}
        onClick={() => {
          submitSignUp();
        }}
      >
        {isLoading ? <div className="loader" /> : "ثبت نام"}
      </Button>
    </div>
  );
}

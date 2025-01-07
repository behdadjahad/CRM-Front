"use client";
import LoginForm from "@/components/login/login-form";
import Logo from "@/components/shared/logo";
import { useFormik } from "formik";
import * as Yup from "yup";
import OrganizationInformation from "@/components/login/organization-information";
import { REQUIRED_TEXT } from "@/lib/utils";

export default function Login() {
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

  return (
    <div className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 lg:p-28 mr-0  lg:mr-12">
        <Logo
          labelClassName="hidden"
          className="object-contain w-24 h-24 mb-2"
        />

        <LoginForm formik={formik} />
      </div>

      <OrganizationInformation className="lg:w-1/2 hidden lg:block" />
    </div>
  );
}

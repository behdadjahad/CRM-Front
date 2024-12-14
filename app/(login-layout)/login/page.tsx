"use client"
import LoginForm from "@/components/login/login-form"
import ResetPasswordForm from "@/components/login/reset-password-form"
import VerificationForm from "@/components/login/verificartion-form"
import Logo from "@/components/shared/logo"
import Image from "next/image"
import { credentialData } from "@/constants/credentials";

export default function Login() {
  return (
    <div className="flex bg-white h-screen flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 lg:p-28 mr-0  lg:mr-12">

        <Logo label="" className="object-contain w-24 h-24 mb-2" />
        <LoginForm />
        {/* <ResetPasswordForm /> */}
        {/* <VerificationForm /> */}

      </div>
      <div className="w-1/2 hidden lg:block">
        <Image
          src="/images/banner.png"
          alt="Logo"
          width={680}
          height={900}
          className="object-cover h-full absolute bottom-0 left-0 top-0"
        />
        <p className="absolute left-10 top-20 text-3xl text-white">Travel Agency CRM</p>
        <div className="absolute left-24 bottom-10 text-white flex gap-2"><span>شماره تلفن:</span><span>{credentialData.phoneNumber}</span></div>
      </div>
    </div>
  );
}


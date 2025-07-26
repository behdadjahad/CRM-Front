
'use client'

import OrganizationInformation from "@/components/login/organization-information";
import SignUpForm from "@/components/signup/sign-up-form";
import CompanyLogo from "@/components/shared/company-logo";
import { useEffect } from "react";
import { fetchCities } from "@/store/city-slice";
import { useDispatch } from "react-redux";

export default function SignUp() {
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);
  return (
    <div className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 lg:p-28 mr-0  lg:mr-12">
        <CompanyLogo
          labelClassName="hidden"
          className="object-contain w-28 h-12 mb-2"
        />

        <SignUpForm />
      </div>

      <OrganizationInformation className="lg:w-1/2 hidden lg:block" />
    </div>
  );
}

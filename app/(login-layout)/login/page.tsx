import LoginForm from "@/components/login/login-form";
import Logo from "@/components/shared/logo";
import OrganizationInformation from "@/components/login/organization-information";

export default function Login() {
  return (
    <div className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 lg:p-28 mr-0  lg:mr-12">
        <Logo
          labelClassName="hidden"
          className="object-contain w-24 h-24 mb-2"
        />

        <LoginForm />
      </div>

      <OrganizationInformation className="lg:w-1/2 hidden lg:block" />
    </div>
  );
}

import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function LoginForm({ formik }: any) {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function loginHandler() {
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
            type: passwordVisible ? "text" : "password",
            floating: true,
            passwordIcon: passwordVisible
              ? "/images/x-eye.png"
              : "/images/eye.png",
            className: "m-0 w-full",
            toggleVisibility: toggleVisibility,
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

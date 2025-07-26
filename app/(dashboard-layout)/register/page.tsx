import RegistrationContainer from "@/components/register/registration-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Register() {
  return (
    <main>
      <Title label="تکمیل اطلاعات حساب" />

      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "تکمیل فرم ثبت نام",
          },
        ]}
          />
       <RegistrationContainer />
    </main>
  );
}

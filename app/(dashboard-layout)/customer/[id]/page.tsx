import CustomerDetailContent from "@/components/customer/customer-detail-content";

import Breadcrumb from "@/components/shared/breadcrumb";
import PersonInfoContainer from "@/components/shared/person-info-container";
import { PersonInfoInterface } from "@/components/shared/person-info-container";
import Title from "@/components/shared/title";
import Image from "next/image";

export default function CustomerDetail() {
  const customer: PersonInfoInterface = {
    list: [
      {
        label: "",
        value: "",
        children: (
          <Image
            src={"/images/customer.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-full w-full border-4 border-primary-foreground rounded-full"
          />
        ),
      },
      {
        label: "نام و نام خانوادگی",
        value: "محمد برزگر",
      },
      {
        label: "کدملی",
        value: "2281754826",
      },
      {
        label: "تاریخ تولد",
        value: "6 اردیبهشت 1368",
      },
    ],
  };

  return (
    <main>
      <Title label="ثبت سرویس هتل" />

      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "مشتری",
          },
        ]}
      />
      <div>
        <PersonInfoContainer {...customer} />
        <CustomerDetailContent
          tabList={["آماروگزارش ها", "اطلاعات شخصی", "قراردادها", "پیگیری ها"]}
        />
      </div>
    </main>
  );
}

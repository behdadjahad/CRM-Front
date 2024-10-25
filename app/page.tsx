"use client"

import Breadcrumb from "@/components/shared/breadcrumb";
import EditableContainer from "@/components/shared/editable-container";
import FormExtender from "@/components/shared/form-extender";
import Title from "@/components/shared/title";
import { PersonalInfoFormExtender } from "@/constants/extendable-fields";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div>
        <Title label="ثبت قرارداد" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: ""
            },
            {
              label: "قرارداد جدید"
            }
          ]}
        />
      </div>

      <EditableContainer
        list={[
          {
            label: "تاریخ درج",
            value: "1403/04/23"
          },
          {
            label: "تاریخ قرارداد",
            value: "1403/05/02"
          },
          {
            label: "شماره قرار داد",
            value: "358067357101"
          },
          {
            label: "موضوع قرار داد",
            value: "تور داخلی"
          },
          {
            label: "توضیحات",
            value: "..."
          }
        ]}
        action={{
          label: "ویرایش اطلاعات",
          icon: <Image src={'/icons/edit.png'} alt="edit" width={24} height={24} />,
          click: () => console.log("clicked")
        }}
      />

      <FormExtender title="اطلاعات شخصی"
        fields={PersonalInfoFormExtender.fields}
        initialValues={PersonalInfoFormExtender.initialValues}
        validationSchema={PersonalInfoFormExtender.validationSchema}
      />
    </main>
  );
}

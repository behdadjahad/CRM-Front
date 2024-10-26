"use client"

import Breadcrumb from "@/components/shared/breadcrumb";
import EditableContainer from "@/components/shared/editable-container";
import ExtendableFormTabContainer from "@/components/shared/extendable-form-tab-container";
import Title from "@/components/shared/title";
import { ContactInfoFormExtender, PersonalInfoFormExtender } from "@/constants/extendable-fields";
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

      <ExtendableFormTabContainer
        tabs={[
          {
            title: "اطلاعات مشتری",
            forms: [
              PersonalInfoFormExtender,
              ContactInfoFormExtender,
            ]
          },
          {
            title: "اطلاعات محل سکونت",
            forms: [
              ContactInfoFormExtender,
              PersonalInfoFormExtender,
            ]
          },
          {
            title: "اطلاعات محل کار",
            forms: [
              PersonalInfoFormExtender,
            ]
          }
        ]} />


    </main>
  );
}

"use client";

import Breadcrumb from "@/components/shared/breadcrumb";
import EditableContainer from "@/components/contract/editable-container";
import ExtendableFormTabContainer from "@/components/shared/extendable-form-tab-container";
import ServiceContainer from "@/components/shared/service-container";
import Title from "@/components/shared/title";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ContactInfoFormExtender,
  LivingInformationExtender,
  organizationInformationExtender,
  PersonalInfoFormExtender,
  workInformationExtender,
} from "@/constants/extendable-fields";
import Image from "next/image";
import { useEffect, useState } from "react";
import RegisteryForm from "@/components/contract/registery-form";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/api/contract";
import { ServiceCardInterface } from "@/components/shared/service-card";

export default function Contract() {
  const [category, setCategory] = useState("personal");
  const [formServices, setFormServices] = useState<ServiceCardInterface[]>([]);
  const { data } = useQuery({
    queryKey: ["serviceQuery"],
    queryFn: () => getServices(),
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setFormServices(
        data.data.map((item: any) => ({
          id: item.id,
          image: item.iconFile,
          title: item.name,
        }))
      );
    }
  }, [data]);

  return (
    <main>
      <div>
        <Title label="ثبت قرارداد" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "قرارداد جدید",
            },
          ]}
        />
      </div>

      <EditableContainer
        list={[
          {
            label: "تاریخ درج",
            value: "1403/04/23",
          },
          {
            label: "تاریخ قرارداد",
            value: "1403/05/02",
          },
          {
            label: "شماره قرار داد",
            value: "358067357101",
          },
          {
            label: "موضوع قرار داد",
            value: "تور داخلی",
          },
          {
            label: "توضیحات",
            value: "...",
          },
        ]}
        action={{
          label: "ویرایش اطلاعات",
          icon: (
            <Image src={"/icons/edit.png"} alt="edit" width={24} height={24} />
          ),
          click: () => console.log("clicked"),
        }}
      />

      <RadioGroup
        defaultValue="personal"
        className="flex flex-row-reverse gap-4 min-h-10"
      >
        <div className="flex items-center space-x-2">
          <label htmlFor="personal">شخصی</label>
          <RadioGroupItem
            value="personal"
            id="personal"
            onClick={() => setCategory("personal")}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="organization">سازمانی</label>
          <RadioGroupItem
            value="organization"
            id="organization"
            onClick={() => setCategory("organization")}
          />
        </div>
      </RadioGroup>

      {category === "personal" ? (
        <ExtendableFormTabContainer
          defaultValue="اطلاعات مشتری"
          tabs={[
            {
              title: "اطلاعات مشتری",
              forms: [PersonalInfoFormExtender, ContactInfoFormExtender],
              children: (
                <ServiceContainer
                  askQuestion={false}
                  services={formServices}
                  multiChosen={true}
                />
              ),
            },
            {
              title: "اطلاعات محل سکونت",
              forms: [LivingInformationExtender, PersonalInfoFormExtender],
              children: (
                <ServiceContainer
                  askQuestion={false}
                  services={formServices}
                  multiChosen={true}
                />
              ),
            },
            {
              title: "اطلاعات محل کار",
              forms: [workInformationExtender, PersonalInfoFormExtender],
              children: (
                <ServiceContainer
                  askQuestion={false}
                  services={formServices}
                  multiChosen={true}
                />
              ),
            },
          ]}
        />
      ) : (
        <ExtendableFormTabContainer
          defaultValue="اطلاعات سازمان"
          tabs={[
            {
              title: "اطلاعات سازمان",
              forms: [organizationInformationExtender, ContactInfoFormExtender],
              children: (
                <ServiceContainer
                  askQuestion={false}
                  services={formServices}
                  multiChosen={true}
                >
                  <RegisteryForm />
                </ServiceContainer>
              ),
            },
          ]}
        />
      )}
    </main>
  );
}

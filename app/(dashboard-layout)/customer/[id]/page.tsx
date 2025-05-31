"use client";
import { getCustomerPersonalInfo } from "@/api/customer";
import CustomerDetailContent from "@/components/customer/customer-detail-content";

import Breadcrumb from "@/components/shared/breadcrumb";
import PersonInfoContainer from "@/components/shared/person-info-container";
import { PersonInfoInterface } from "@/components/shared/person-info-container";
import Title from "@/components/shared/title";
import { convertDate } from "@/lib/date";
import { dateType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { set } from "lodash";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function CustomerDetail() {
  const [customer, setCustomer] = useState<any>();
  const { id } = useParams();
  const { data: customerPersonalData } = useQuery({
    queryKey: ["customerPersonalData"],
    queryFn: () => getCustomerPersonalInfo(Number(id)),
  });
  useEffect(() => {
    if (customerPersonalData?.data) {
      const customerData: PersonInfoInterface = {
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
                className="h-full w-full border-4 border-primary-foreground rounded-full object-cover"
              />
            ),
          },
          {
            label: "نام و نام خانوادگی",
            value: customerPersonalData?.data?.person?.fullName,
          },
          {
            label: "کدملی",
            value: customerPersonalData?.data?.person?.idNumber,
          },
          {
            label: "تاریخ تولد",
            value: customerPersonalData?.data?.person?.birthdate
              ? convertDate(
                  customerPersonalData?.data?.person?.birthdate,
                  dateType
                )
              : "",
          },
          {
            label: "شماره شناسنامه",
            value: customerPersonalData?.data?.person?.idCertificate,
          },
          {
            label: "شغل",
            value:
              customerPersonalData?.data?.person?.personJobs[0]?.jobs?.name,
          },
          {
            label: "رضایتمندی",
            value: "",
          },
        ],
      };
      setCustomer(customerData);
    }
  }, [customerPersonalData]);

  return (
    <main>
      <Title label="اطلاعات مشتری" />

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
          tabList={["اطلاعات شخصی", "قراردادها", "پیگیری ها"]}
          // tabList={["آماروگزارش ها", "اطلاعات شخصی", "قراردادها", "پیگیری ها"]}
        />
      </div>
    </main>
  );
}

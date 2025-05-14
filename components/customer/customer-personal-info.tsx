"use client"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Overview, { OverviewInterface } from "../satisfaction/overview";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCustomerPersonalInfo } from "@/api/customer";
import { useEffect, useState } from "react";
export function CustomerPersonalInfo() {
  const { id } = useParams();
  const [contactInfo, setContactInfo] = useState<any[]>([]);
  const { data: customerPersonalInfo } = useQuery({
    queryKey: ["customerPersonalInfo"],
    queryFn: () => getCustomerPersonalInfo(Number(id) as number),
  });
  useEffect(() => {
    if (customerPersonalInfo) {
     
      const contactInfoData = [
        {
          icon: "/icons/phone-icon.png",
          value: "",
          className: "bg-[#DEEBFB]",
          iconClassName: "w-5 h-5",
        },
        {
          icon: "/icons/mobile-icon.png",
          value: "",
          className: "bg-[#D0CFFF]",
          iconClassName: "w-4 h-6",
        },
        {
          icon: "/icons/email-icon.png",
          value: "",
          className: "bg-[#DFF7EB]",
          iconClassName: "w-5 h-4",
        },
        {
          icon: "/icons/website-icon.png",
          value: "",
          className: "bg-[#FADAD1]",
          iconClassName: "w-5 h-5",
        },
      ];
      setContactInfo(contactInfoData);
    }
  }, [customerPersonalInfo]);
  const satisfaction = 4;
  const totalVotes = 10;
  const score = (satisfaction * 100) / totalVotes;

  const satisfactionScheduleData: OverviewInterface = {
    list: [
      {
        label: "ثبت رضایتمندی",
        value: "1403/04/23",
        icon: (
          <Image
            src={"/icons/calendar-tick.png"}
            width={16}
            height={16}
            className="object-cover w-4 h-4"
            alt="ثبت رضایتمندی"
          />
        ),
      },
      {
        label: "پیگیری رضایتمندی",
        value: "1403/04/29",
        icon: (
          <Image
            src={"/icons/calendar-untick.png"}
            width={16}
            height={16}
            className="object-cover w-4 h-4"
            alt="پیگیری رضایتمندی"
          />
        ),
      },
    ],
  };
  // const contactInfo = [
  //   {
  //     icon: "/icons/phone-icon.png",
  //     value: "021-3467-8954",
  //     className: "bg-[#DEEBFB]",
  //   },
  //   {
  //     icon: "/icons/phone-icon.png",
  //     value: "021-3467-8954",
  //     className: "bg-[#DEEBFB]",
  //   },
  //   {
  //     icon: "/icons/phone-icon.png",
  //     value: "021-3467-8954",
  //     className: "bg-[#4AD991]",
  //   },
  //   {
  //     icon: "/icons/phone-icon.png",
  //     value: "021-3467-8954",
  //     className: "bg-[#DEEBFB]",
  //   },
  // ];
  const addressesInfo = [
    {
      title: "اطلاعات محل کار",
      list: [
        {
          address:
            "دفتر مرکزی، فارس. شیراز. خیابان حکیمی . سمت چب، کوچه 6. ساختمان ونوس واحد 1",
          postalCode: { label: "کدپستی", value: "۷۱۹۶۵-۴۱۲۹۰" },
          phone: { label: "تلفن", value: "071 37346297" },
        },
        {
          address:
            "دفتر مرکزی، فارس. شیراز. خیابان حکیمی . سمت چب، کوچه 6. ساختمان ونوس واحد 1",
          postalCode: { label: "کدپستی", value: "۷۱۹۶۵-۴۱۲۹۰" },
          phone: { label: "تلفن", value: "071 37346297" },
        },
      ],
    },
    {
      title: "اطلاعات محل کار",
      list: [
        {
          address:
            "دفتر مرکزی، فارس. شیراز. خیابان حکیمی . سمت چب، کوچه 6. ساختمان ونوس واحد 1",
          postalCode: { label: "کدپستی", value: "۷۱۹۶۵-۴۱۲۹۰" },
          phone: { label: "تلفن", value: "071 37346297" },
        },
        {
          address:
            "دفتر مرکزی، فارس. شیراز. خیابان حکیمی . سمت چب، کوچه 6. ساختمان ونوس واحد 1",
          postalCode: { label: "کدپستی", value: "۷۱۹۶۵-۴۱۲۹۰" },
          phone: { label: "تلفن", value: "071 37346297" },
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-6 gap-4 bg-transparent mt-4 w-full">
      <div className="col-span-2 flex flex-col gap-4 bg-card rounded-lg p-6">
        اطلاعات تماس
        {contactInfo.map((item, index) => (
          <div className="flex items-center gap-2" key={index}>
            <div
              className={cn(
                "rounded-md w-10 h-10 flex items-center justify-center",
                item.className
              )}
            >
              {" "}
              <Image
                src={item?.icon}
                alt="personal-info"
                width={1024}
                height={1024}
                className={item.iconClassName}
              />
            </div>
            <div>{item.value}</div>
          </div>
        ))}
      </div>
      <div className="col-span-3 flex flex-col bg-transparent rounded-lg gap-4">
        {addressesInfo.map((item, index) => (
          <div
            className="bg-card rounded-lg p-6 flex flex-col gap-4"
            key={index}
          >
            <div>{item.title}</div>
            {item.list.map((listItem, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="flex flex-row gap-2 items-center">
                  {" "}
                  <Image
                    src="/icons/primary-location.png"
                    alt="address"
                    width={24}
                    height={24}
                    className="w-3 h-4"
                  />
                  <div>{listItem.address}</div>
                </div>
                <div className="flex justify-between">
                  {" "}
                  <div className="flex">
                    <span>{listItem.postalCode.label}:</span>
                    <span>{listItem.postalCode.value}</span>
                  </div>
                  <div className="flex">
                    <span>{listItem.phone.label}:</span>
                    <span>{listItem.phone.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="bg-[#C9D3F4] rounded-lg p-6 col-span-1 flex flex-col items-center justify-between">
        <h2>میزان رضایت مندی</h2>
        <div className="w-36 h-36">
          <CircularProgressbarWithChildren
            value={score}
            styles={buildStyles({
              pathColor: "#FFA500",
              trailColor: "#E9EAEB",
            })}
          >
            <div className="text-center  text-sm flex flex-col gap-2">
              <span>میانگین امتیاز</span>
              <span className="font-bold text-info">
                {totalVotes} / {(score * totalVotes) / 100}
              </span>
            </div>
            {/* <FaStar style={{ fontSize: "32px", color: "#00bcd4" }} /> */}
          </CircularProgressbarWithChildren>
        </div>
        <div>
          {" "}
          (از مجموع<span>{totalVotes}</span> امتیاز)
        </div>
        <Overview {...satisfactionScheduleData} className="bg-transparent" />
      </div>
    </div>
  );
}

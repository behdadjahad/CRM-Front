"use client";
import { cn, dateType, totalVotes } from "@/lib/utils";
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

import { clientAddress, Communicater } from "@/types/globals";
import { convertDate } from "@/lib/date";
export function CustomerPersonalInfo() {
  const { id } = useParams();
  const [personalContactInfo, setPersonalContactInfo] = useState<any[]>([]);
  const [satisfactionSchedule, setSatisfactionSchedule] = useState<any>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [satisfactionScore, setSatisfactionScore] = useState<number>(0);
  const { data: customerPersonalInfo } = useQuery({
    queryKey: ["customerPersonalInfo"],
    queryFn: () => getCustomerPersonalInfo(Number(id) as number),
  });
  useEffect(() => {
    if (customerPersonalInfo?.data) {
      const contactInfo = customerPersonalInfo?.data?.Communication;
      const score =
        customerPersonalInfo?.data?.satisfaction?.avgSatisfactionScore;

      const contactInfoData = [
        {
          icon: "/icons/phone-icon.png",
          value: contactInfo?.homePhone?.[0]?.communicationDetails,
          className: "bg-[#DEEBFB]",
          iconClassName: "w-5 h-5",
        },
        {
          icon: "/icons/mobile-icon.png",
          value: contactInfo?.mobile?.[0]?.communicationDetails,
          className: "bg-[#D0CFFF]",
          iconClassName: "w-4 h-6",
        },
        {
          icon: "/icons/email-icon.png",
          value: contactInfo?.email?.find(
            (item: any) => item?.communicater === Communicater.home
          )?.communicationDetails,
          className: "bg-[#DFF7EB]",
          iconClassName: "w-5 h-4",
        },
        {
          icon: "/icons/website-icon.png",
          value: contactInfo?.website?.find(
            (item: any) => item?.communicater === Communicater.home
          )?.communicationDetails,
          className: "bg-[#FADAD1]",
          iconClassName: "w-5 h-5",
        },
      ];
      const addressesInfo = customerPersonalInfo?.data?.address?.map(
        (item: any) => {
          switch (item.addressTypeId) {
            case clientAddress.livingAddress:
              return {
                title: "اطلاعات محل سکونت",
                list: [
                  {
                    address: item?.address,
                    postalCode: { label: "کدپستی", value: item?.postalCode },
                    phone: {
                      label: "تلفن",
                      value: contactInfo?.homePhone?.[0]?.communicationDetails,
                    },
                  },
                ],
              };
            case clientAddress.workAddress:
              return {
                title: "اطلاعات محل کار",
                list: [
                  {
                    address: item?.address,
                    postalCode: { label: "کدپستی", value: item?.postalCode },
                    phone: {
                      label: "تلفن",
                      value:
                        contactInfo?.businessPhone[0]?.communicationDetails,
                    },
                  },
                ],
              };
          }
        }
      );
      const satisfactionDate = {
        submitDate: customerPersonalInfo?.data?.satisfaction?.lastSatisfaction
          ?.submittedDateTime
          ? convertDate(
              customerPersonalInfo?.data?.satisfaction?.lastSatisfaction
                ?.submittedDateTime,
              dateType
            )
          : "",
        followUpDate: customerPersonalInfo?.data?.satisfaction?.lastSatisfaction
          ?.followUpDate
          ? convertDate(
              customerPersonalInfo?.data?.satisfaction?.lastSatisfaction
                ?.followUpDate,
              dateType
            )
          : "",
      };
      setPersonalContactInfo(contactInfoData);
      setAddresses(addressesInfo);
      setSatisfactionScore(score);
      setSatisfactionSchedule(satisfactionDate);
    }
  }, [customerPersonalInfo]);
 
  const satisfactionScheduleData: OverviewInterface = {
    list: [
      {
        label: "ثبت رضایتمندی",
        value: satisfactionSchedule?.submitDate,
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
        value: satisfactionSchedule?.followUpDate,
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

  return (
    <div className="flex flex-col flex-wrap lg:grid lg:grid-cols-6 gap-4 bg-transparent mt-4 w-full">
      <div className="col-span-2 flex flex-col gap-4 bg-card rounded-lg p-6">
        اطلاعات تماس
        {personalContactInfo?.map((item, index) => (
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
                className={item?.iconClassName}
              />
            </div>
            <div>{item?.value}</div>
          </div>
        ))}
      </div>
      <div className="col-span-3 flex flex-col bg-transparent rounded-lg gap-4">
        {addresses.length > 0 ? (
          addresses?.map((item, index) => (
            <div
              className="bg-card rounded-lg p-6 flex flex-col gap-4"
              key={index}
            >
              <div>{item?.title}</div>
              {item?.list?.map((listItem: any, index: number) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2 items-center">
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
          ))
        ) : (
          <div className="bg-card rounded-lg p-6 flex flex-col gap-4">
            آدرسی یافت نشد
          </div>
        )}
      </div>
      <div className="bg-[#C9D3F4] rounded-lg p-6 col-span-1 flex flex-col items-center justify-between gap-2">
        <h2>میزان رضایت مندی</h2>
        <div className="w-24 h-24 lg:w-36 lg:h-36">
          <CircularProgressbarWithChildren
            value={(satisfactionScore * 100) / totalVotes}
            styles={buildStyles({
              pathColor: "#FFA500",
              trailColor: "#E9EAEB",
            })}
          >
            <div className="text-center  text-sm flex flex-col gap-2">
              <span>میانگین امتیاز</span>
              <span className="font-bold text-info">
                {totalVotes} / {satisfactionScore}
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

"use client";

import React, { useState } from "react";
import ServiceCard, { ServiceCardInterface } from "../shared/service-card";
import { cn } from "@/lib/utils";
import Image from "next/image";

import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";

//import Satisfaction from "../section/satisfaction";
import dynamic from "next/dynamic";
import Satisfaction from "../section/satisfaction";
import Link from "next/link";
// import Satisfaction from "../section/satisfaction";

export interface ContractCardInterface {
  id: string;
  header: {
    icon: string;
    title: string;
    submitDate: string;
    contractNumber: string;
  };
  user: {
    image: string;
    name: string;
  };
  contract: {
    date: string;
    submitter: string;
    destination: string;
    unit: string;
  };
  score: {
    totalVotes: number;
    final: number;
    id: number;
    isSubmitted: boolean;
  };
  services: ServiceCardInterface[];
  footer: {
    income: string;
    cost: string;
    overall: string;
  };
  className?: string;
}

export default function ContractCard({
  id,
  contract,
  footer,
  header,
  score,
  services,
  user,
  className,
}: ContractCardInterface) {
  const contractData = [
    {
      icon: "/icons/calendar-mute.png",
      label: "تاریخ قرارداد",
      value: contract?.date ?? "",
    },
    {
      icon: "/icons/user-mute.png",
      label: "ثبت کننده",
      value: contract?.submitter ?? "",
    },
    {
      icon: "/icons/user-mute.png",
      label: "مشتری",
      value: "",
    },
    {
      icon: "/icons/map.png",
      label: "مقصد",
      value: contract?.destination ?? "",
    },
    {
      icon: "/icons/dollar.png",
      label: "واحد ارز",
      value: contract?.unit ?? "",
    },
  ];

  const RatingChart = dynamic(() => import("../shared/rating-chart"), {
    ssr: false,
  });
  const [openModal, setOpenModal] = useState(false);
  return (
    <Link
      className={cn(
        "flex flex-col w-full bg-card rounded-lg overflow-hidden shadow-[0px_12px_24px_-4px_#919EAB1F]",
        className
      )}
      href={`/contract/service/${id}`}
    >
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#253159_100%)] py-2.5 px-3.5 flex items-center justify-between w-full text-primary-foreground">
        <div className="flex items-center gap-2">
          <Image
            src={header?.icon}
            alt={header?.title}
            width={20}
            height={24}
            className="w-5 h-6"
          />

          <span className="text-lg font-bold">{header?.title}</span>
        </div>

        <div className="flex flex-col text-xs leading-5 gap-1">
          <span>تاریخ ثبت: {header?.submitDate}</span>

          <div className="flex">
            <span>شماره قرارداد:</span>
            <span>{header?.contractNumber}</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={user?.image}
            alt={user?.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />

          <span className="text-sm">{user?.name}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {contractData &&
              contractData?.map((item) => (
                <div
                  key={item?.label + item?.value}
                  className="flex text-xs w-full items-center gap-1"
                >
                  <Image
                    src={item?.icon ?? ""}
                    alt={item?.label ?? ""}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />

                  <span className="text-sm col-span-4 w-24">{item?.label}</span>

                  <span className="col-span-5 font-bold">{item?.value}</span>
                </div>
              ))}
          </div>

          <div
            className="w-28 flex flex-col items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <RatingChart value={score?.final} color="#FFA500" />

            <div className="text-center text-[10px] relative -mt-2 flex items-center gap-1">
              از مجموع {score?.totalVotes} امتیاز
              {/* <Link href={`/sale/satisfaction/${id}`}> */}
              <div
                // onClick={() => {
                //   setOpenModal(true);
                // }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenModal(true);
                }}
              >
                <Image
                  src={"/icons/edit-pen.png"}
                  alt="ادیت"
                  width={16}
                  height={16}
                />
              </div>
              <CustomModal
                minWidth="0"
                maxWidth="700px"
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
                contentLabel="رضایت مندی"
              >
                <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
                  <span className="text-lg font-bold">نظر خود را ثبت کنید</span>
                  <MdClose
                    size={20}
                    onClick={(e) => {
                      setOpenModal(false);
                      e.stopPropagation();
                    }}
                    className="cursor-pointer"
                  />
                </div>
                <Satisfaction
                  onCloseHandler={() => {
                    setOpenModal(false);
                  }}
                  itemId={id}
                  // score={score?.final}
                  // totalVotes={score?.totalVotes}
                  score={score}
                />
              </CustomModal>
              {/* </Link> */}
            </div>
          </div>
        </div>

        <div className="flex justify-start gap-2">
          {services &&
            services.length > 0 &&
            services.map((item) => (
              <ServiceCard
                {...item}
                key={item?.title + header?.title + user?.name}
                className="min-w-20 max-w-20 h-auto text-[8px] text-right items-start "
                imageClassName="min-w-0 h-16"
              />
            ))}
        </div>
      </div>

      <div className="py-3.5 px-6 text-xs flex items-center justify-between gap-4 border-t text-muted-active">
        <span>درآمد: {footer?.income}</span>
        <span>هزینه: {footer?.cost}</span>
        <span>سود/زیان: {footer?.overall}</span>
      </div>
    </Link>
  );
}

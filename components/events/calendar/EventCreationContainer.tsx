"use client";

import CustomModal from "@/components/shared/custom-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import LeadContactTypeContainer, {
  LeadContactTypeContainerInterface,
} from "../lead/LeadContactTypeContainer";
import AddCustomerToFeatureContainer from "../AddCustomerToFeatureContainer";
import { CustomerDataInterface } from "@/components/service/customer-infinite-card";

export default function EventCreationContainer() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerDataInterface>();
  const [activeLeadContactType, setActiveLeadContactType] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });
  const { LeadContactTypeList } = getData();
  return (
    <>
      <Button
        variant={"info"}
        onClick={() => {
          setOpenModal(true);
        }}
        // className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        افزودن رویداد
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">رویداد جدید</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span>نوع درخواست </span>
            <span>
              {activeLeadContactType.label &&
                `( ${activeLeadContactType.label} )`}
            </span>
          </div>
          <LeadContactTypeContainer
            list={LeadContactTypeList}
            onActiveItem={(label: string, value: string) => {
              setActiveLeadContactType({ label, value });
            }}
            activeItem={activeLeadContactType}
          />
        </div>
        <AddCustomerToFeatureContainer
          onSendSelectedCustomer={(selectedCustomer: CustomerDataInterface) => {
            console.log(selectedCustomer);
            setCustomer(selectedCustomer);
          }}
          onSendCustomerData={(customerData: CustomerDataInterface) => {
            setCustomer(customerData);
          }}
        />

        {/* <TextEditorInput /> */}

        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
              setActiveLeadContactType({ label: "", value: "" });
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
    </>
  );
  function getData() {
    const LeadContactTypeList: LeadContactTypeContainerInterface["list"] = [
      {
        label: "تماس",
        value: "phone",
        icon: "/icons/colored-phone-icon.png",
        activeClassName: "border border-[#EF26B2]",
        className: "text-[#C11574] bg-[#FDF2FA]",
      },
      {
        label: "پیامک",
        value: "sms",
        icon: "/icons/colored-sms-icon.png",
        activeClassName: "border border-[#039855]",
        className: "text-[#087443] bg-[#EDFCF2]",
      },
      {
        label: "ایمیل",
        value: "email",
        icon: "/icons/colored-email-icon.png",
        activeClassName: "border border-[#1C68DA]",
        className: "text-[#175CD3] bg-[#EFF8FF]",
      },
      {
        label: "جلسه",
        value: "meeting",
        icon: "/icons/colored-meeting-icon.png",
        activeClassName: "border border-[#7500FE]",
        className: "text-[#6941C6] bg-[#F9F5FF]",
      },
      {
        label: "VOIP",
        value: "VOIP",
        icon: "/icons/colored-voip-icon.png",
        activeClassName: "border border-[#D92D20]",
        className: "text-[#B93815] bg-[#FEF6EE]",
      },
    ];
    return { LeadContactTypeList };
  }
}

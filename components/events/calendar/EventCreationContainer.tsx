"use client";
import * as Yup from "yup";
import CustomModal from "@/components/shared/custom-modal";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import LeadContactTypeContainer, {
  LeadContactTypeContainerInterface,
} from "../lead/LeadContactTypeContainer";
import AddCustomerToFeatureContainer from "../AddCustomerToFeatureContainer";
import { CustomerDataInterface } from "@/components/service/customer-infinite-card";
import QuillEditor from "@/components/shared/input/TextEditorInput";
import { generateCreationEventForms } from "@/constants/event-creation-form-fields";
import { useFormik } from "formik";
import FormMaker from "@/components/shared/form-maker";
import { useQuery } from "@tanstack/react-query";
import { getfollowUpTypes } from "@/api/follow-up";

export default function EventCreationContainer() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerDataInterface>();
  const [content, setContent] = useState("");
  const [activeLeadContactType, setActiveLeadContactType] = useState<{
    label: string;
    value: string;
  }>({ label: "تماس", value: "phone" });

  const { LeadContactTypeList } = getData(activeLeadContactType.value);
  const formik = useFormik({
    initialValues: {
      emailContent: "",
    },

    // validationSchema: Yup.object({
    //   emailContent: Yup.string().required("متن ایمیل الزامی است"),
    // }),
    onSubmit: () => {},
  });
  const { data: leadFormsData } = useQuery({
    queryKey: ["leadFormsData", activeLeadContactType.value],
    queryFn: async () => await getfollowUpTypes(),
    enabled: !!activeLeadContactType.value,
  });
  useEffect(() => {
    console.log(leadFormsData?.data);
  }, [leadFormsData]);
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
        <div className="flex justify-between items-center ">
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
        <FormMaker
          form={formik}
          fields={[
            {
              key: "smsContent",
              component: "textarea",
              placeholder: "متن پیامک خود را بنویسید",
              type: "text",
              floating: true,
              className: "w-full",
            },
            {
              key: "smsDate",
              dependantKey: "smsDateType",
              component: "date-time",
              placeholder: "تاریخ وزمان",
              type: "text",
              floating: true,
              className: "w-full md:w-1/2",
            },
            {
              key: "smsSubject",
              component: "input",
              placeholder: "موضوع پیامک",
              type: "text",
              floating: true,
              className: "w-full md:w-1/2",
            },
            {
              key: "userResponsible",
              component: "input",
              placeholder: "مسئول پیگیری",
              type: "text",
              floating: true,
              className: "w-full md:w-1/2",
            },
            {
              key: "smsCenter",
              component: "Select",
              placeholder: "انتخاب شماره",
              type: "text",
              floating: true,
              className: "w-full md:w-1/2",
              options: [],
            },
            {
              key: "description",
              component: "textarea",
              placeholder: "توضیحات",
              type: "text",
              floating: true,
              className: "w-full",
            },
          ]}
          className=" w-full mt-4"
        />{" "}
        <AddCustomerToFeatureContainer
          onSendSelectedCustomer={(selectedCustomer: CustomerDataInterface) => {
            console.log(selectedCustomer);
            setCustomer(selectedCustomer);
          }}
          onSendCustomerData={(customerData: CustomerDataInterface) => {
            setCustomer(customerData);
          }}
          multiSelect={true}
        />
        {/* <QuillEditor value={content} onChange={setContent} /> */}
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
  function getData(leadType: string) {
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
    const formData = generateCreationEventForms(leadType);
    return { LeadContactTypeList, formData };
  }
}

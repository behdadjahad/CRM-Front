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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLaedfollowUpTypes } from "@/api/follow-up";
import { createClient } from "@/api/client";
import CustomerCard, {
  CustomerCardInterface,
} from "@/components/share/customer/CustomerCard";
import { addEvent } from "@/api/event";
import { convertDateTimeToGregorian } from "@/lib/date";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { fetchAllUsers } from "@/store/all-users-slice";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
interface EventCreationContainerInterface {
  useForDetail?: boolean;
}
export default function EventCreationContainer({
  useForDetail,
}: EventCreationContainerInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerDataInterface[]>([]);
  const queryClient = useQueryClient();
  const [fields, setFields] = useState([]);
  const [followUpTypeList, setFollowUpTypeList] = useState<any[]>([]);
  const [activeLeadContactType, setActiveLeadContactType] = useState<{
    label: string;
    value: string;
    id?: number;
  }>(followUpTypeList?.[1]);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  const userOptions = useSelector((state: any) => state.allUsers.items);
 
  const userData = useSelector((state: RootState) => state.user);
  const { LeadContactTypeList } = getData(activeLeadContactType?.value);
 
  const formik = useFormik({
    initialValues: {
      description: "",
      isAutomatic: false,
      dateTime: "",
      dateTimeType: "",
      subject: "",
      userResponsible: userData?.id,
    },

    // validationSchema: Yup.object({
    //   emailContent: Yup.string().required("متن ایمیل الزامی است"),
    // }),
    onSubmit: () => {},
    enableReinitialize: true,
  });

  const { data: leadFormsData } = useQuery({
    queryKey: ["leadFormsData"],
    queryFn: async () => await getLaedfollowUpTypes(),
  });
  useEffect(() => {
   
    if (leadFormsData?.data?.length > 0) {
      
      const fields = returnFields(
        activeLeadContactType?.value,
        leadFormsData?.data
      );

      setFields(fields);
      const updatedList = LeadContactTypeList.map((item) => {
        const match = leadFormsData?.data?.find(
          (d: any) => d.type === item.value
        );
        return {
          ...item,
          id: match ? match.id : null, // add id if match found
        };
      });

      setFollowUpTypeList(updatedList);
    }
  }, [leadFormsData, activeLeadContactType]);

  function returnFields(leadType: string, data: any[]) {
    const formFields = data.find((item: any) => item?.type === leadType)
      ?.baseJson.fields;
    return formFields || [];
  }
  const { mutate: addPersonInfoHandler } = useMutation({
    mutationFn: (data: any) => {
      return createClient(data);
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        const data = response?.data;
        const customer: CustomerDataInterface = {
          id: response?.data?.customerId,
          email: "",
          phone: "",
          firstName: data?.firstName,
          lastName: data?.lastName,
          idNumber: data?.idNumber,
        };
        setCustomers([...customers, customer]);
      }
    },
  });
  const { mutate: addEventHandler } = useMutation({
    mutationFn: (data: any) => {
      return addEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
      formik.resetForm();
      setCustomers([]);
    },
  });
 
  function addPersonInfo(personData: CustomerDataInterface) {
    const data = {
      firstName: personData.firstName,
      lastName: personData.lastName,
      idNumber: personData.idNumber,
      isMainCustomer: false,
    };
    addPersonInfoHandler(data);
  }
  function SubmitEvents() {
    const customerIds = customers?.map((customer) => customer?.id);
    const data = {
      isAutomatic: formik.values.isAutomatic,
      subject: formik.values.subject,
      body: formik.values.description,
      informationJson: {
        additionalProp1: {},
      },
      eventAt: convertDateTimeToGregorian(
        formik.values.dateTime,
        formik.values.dateTimeType
      ),
      // leadId: 1,
      customerIds: customerIds,
      userResponsibleId: formik.values.userResponsible,
      followUpTypeId: activeLeadContactType?.id,
    };
    addEventHandler(data);
    // console.log(data);
  }
  function submitCheckedCustomers(checkedCustomers: CustomerDataInterface[]) {
  
    const newCustomers = checkedCustomers.filter(
      (checkedCustomer) =>
        !customers.some((customer) => customer.id === checkedCustomer.id)
    );

    setCustomers([...customers, ...newCustomers]);
  }

  return (
    <>
      {!useForDetail ? (
        <Button
          variant={"info"}
          onClick={() => {
            setOpenModal(true);
          }}
          // className={cn("text-aqua-foreground flex justify-end w-full")}
        >
          افزودن رویداد
        </Button>
      ) : (
        <Button
          variant={"transparent"}
          onClick={() => {
            setOpenModal(true);
          }}
          className={cn(
            "w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
          )}
        >
          <FaPlus className="text-white" />
        </Button>
      )}

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
              formik.resetForm();
              setCustomers([]);
              setActiveLeadContactType(followUpTypeList?.[0]);
            }}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-between items-center ">
          <div>
            <span>نوع درخواست </span>
            <span>
              {activeLeadContactType?.label &&
                `( ${activeLeadContactType.label} )`}
            </span>
          </div>
          <LeadContactTypeContainer
            list={followUpTypeList}
            onActiveItem={(label: string, value: string, id?: number) => {
              setActiveLeadContactType({ label, value, id });
            }}
            activeItem={activeLeadContactType}
          />
        </div>
        <FormMaker
          form={formik}
          // fields={[
          //   {
          //     key: "smsContent",
          //     component: "textarea",
          //     placeholder: "متن پیامک خود را بنویسید",
          //     type: "text",
          //     floating: true,
          //     className: "w-full",
          //   },
          //   {
          //     key: "smsDate",
          //     dependantKey: "smsDateType",
          //     component: "date-time",
          //     placeholder: "تاریخ وزمان",
          //     type: "text",
          //     floating: true,
          //     className: "w-full md:w-1/2",
          //   },
          //   {
          //     key: "smsSubject",
          //     component: "input",
          //     placeholder: "موضوع پیامک",
          //     type: "text",
          //     floating: true,
          //     className: "w-full md:w-1/2",
          //   },
          //   {
          //     key: "userResponsible",
          //     component: "input",
          //     placeholder: "مسئول پیگیری",
          //     type: "text",
          //     floating: true,
          //     className: "w-full md:w-1/2",
          //   },
          //   {
          //     key: "smsCenter",
          //     component: "Select",
          //     placeholder: "انتخاب شماره",
          //     type: "text",
          //     floating: true,
          //     className: "w-full md:w-1/2",
          //     options: [],
          //   },
          //   {
          //     key: "description",
          //     component: "textarea",
          //     placeholder: "توضیحات",
          //     type: "text",
          //     floating: true,
          //     className: "w-full",
          //   },
          // ]}
          // fields={fields}
          fields={[
            ...fields,
            {
              key: "userResponsible",
              component: "Select",
              placeholder: "مسئول پیگیری",
              type: "text",
              floating: true,
              className: "w-full md:w-1/2",
              options: userOptions,
            },
            {
              key: "description",
              component: "textarea",
              placeholder: "توضیحات",
              type: "text",
              floating: true,
              className: "w-full",
            },
            {
              key: "isAutomatic",
              component: "toggle",
              label: "ارسال خودکار",
              type: "text",
              floating: true,
              className: "w-full",
            },
          ]}
          className=" w-full mt-4"
        />{" "}
        <AddCustomerToFeatureContainer
          onSendSelectedCustomer={(selectedCustomer: CustomerDataInterface) => {
            
            // setCustomer(selectedCustomer);
          }}
          onSendCustomerData={(customerData: CustomerDataInterface) => {
            // setCustomer(customerData);
            addPersonInfo(customerData);
          }}
          onSendCheckedCustomers={(
            checkedCustomers: CustomerDataInterface[]
          ) => {
            submitCheckedCustomers(checkedCustomers);
          }}
          multiSelect={true}
        />
        <div className="p-3 flex flex-col gap-2">
          {customers?.map((customer: any, index: number) => (
            <CustomerCard
              {...customer}
              key={`customer-${index + 1}`}
              onDeleteHandler={(customerId: number) => {
                if (!customerId) return;
                else {
                  setCustomers((prev) =>
                    prev.filter((item) => item.id !== customerId)
                  );
                }
              }}
            />
          ))}
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              setOpenModal(false);
              SubmitEvents();
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
              setActiveLeadContactType({ label: "تماس", value: "CALL" });
              formik.resetForm();
              setCustomers([]);
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
        value: "CALL",
        icon: "/icons/colored-phone-icon.png",
        activeClassName: "border border-[#EF26B2]",
        className: "text-[#C11574] bg-[#FDF2FA]",
      },
      {
        label: "پیامک",
        value: "SMS",
        icon: "/icons/colored-sms-icon.png",
        activeClassName: "border border-[#039855]",
        className: "text-[#087443] bg-[#EDFCF2]",
      },
      {
        label: "ایمیل",
        value: "EMAIL",
        icon: "/icons/colored-email-icon.png",
        activeClassName: "border border-[#1C68DA]",
        className: "text-[#175CD3] bg-[#EFF8FF]",
      },
      {
        label: "جلسه",
        value: "MEET",
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

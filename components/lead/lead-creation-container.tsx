import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker, { OptionType } from "../shared/form-maker";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addLead, getLeadTypes } from "@/api/lead";
import SingleCustomerSelection from "../customer/single-customer-selection";

export default function LeadCreationContainer() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [leadTypeOptions, setLeadTypeOptions] = useState<OptionType[]>([]);
  const { data: leadTypeData } = useQuery({
    queryKey: ["leadTypeData"],
    queryFn: async () => await getLeadTypes(),
  });
  useEffect(() => {
    if (leadTypeData && leadTypeData?.data?.length > 0) {
      const leadTypes = leadTypeData?.data?.map((leadType: any) => ({
        label: leadType?.title,
        value: leadType?.id,
      }));
      setLeadTypeOptions(leadTypes);
    }
  }, [leadTypeData]);
  const formik = useFormik({
    initialValues: {
      leadType: "",
      leadFullName: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const { mutate: addLeadHandler } = useMutation({
    mutationFn: (data: any) => {
      return addLead(data);
    },
    onSuccess: () => {
      setOpenModal(false);
      formik.resetForm();
    },
  });
  function submitForm() {
    const data = {
      lead: {
        leadTypeId: Number(formik.values.leadType),
        body: "",
        temperature: "COLD",
        tags: [],
        // customerId: 1,
      },
      person: {
        isMainCustomer: false,
        fullName: formik.values.leadFullName,
        firstName: formik.values.leadFullName,
        lastName: formik.values.leadFullName,
        idNumber: "123456789",
      },
    };
    addLeadHandler(data);
  }
  return (
    <>
      <Button
        variant={"info"}
        onClick={() => {
          setOpenModal(true);
        }}
        // className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        درخواست جدید
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">ایجاد درخواست جدید</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <FormMaker
          form={formik}
          fields={[
            {
              key: "leadFullName",
              component: "input",
              placeholder: "نام و نام خانوادگی",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full md:w-1/2",
            },

            {
              key: "leadEmail",
              component: "input",
              placeholder: "ایمیل",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full md:w-1/2",
            },
            {
              key: "leadPhone",
              component: "input",
              placeholder: "شماره تماس",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full md:w-1/2",
            },
            {
              key: "leadType",
              component: "Select",
              placeholder: "نوع درخواست",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full md:w-1/2",
              options: leadTypeOptions,
            },
            {
              key: "leadResponsible",
              component: "input",
              placeholder: "مسعول پیگیری",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full md:w-1/2",
            },
          ]}
          className="flex flex-row w-full"
        />
        <SingleCustomerSelection />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              submitForm();
              setOpenModal(false);
              formik.resetForm();
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
              formik.resetForm();
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
    </>
  );
}

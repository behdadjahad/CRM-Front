import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import CustomModal from "../shared/custom-modal";

import AddCustomerToLeadContainer from "./AddCustomerToLeadContainer";
import { CustomerDataInterface } from "../service/customer-infinite-card";
import FormMaker, { OptionType } from "../shared/form-maker";
import { useFormik } from "formik";
import { addLeadTag, editLead, getLeadTags, getLeadTypes } from "@/api/lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import CustomerCard from "../share/customer/CustomerCard";
import { fetchLeads } from "@/store/lead-slice";
export interface LeadEditionContainerInterface {
  editData: {
    id: number;
    leadType: string;
    leadTag: OptionType[];
    customer: CustomerDataInterface;
    body: string;
    leadTemperature: string;
  };
}
export default function LeadEditionContainer({
  editData,
}: LeadEditionContainerInterface) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<any>();
  const currentPage = useSelector((state: any) => state.lead.currentPage);
  const limit = useSelector((state: any) => state.lead.limit);
  const filters = useSelector((state: any) => state.lead.limit)

  const userData=useSelector((state :any )=> state.login)
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [leadTypeOptions, setLeadTypeOptions] = useState<OptionType[]>([]);
  const [leadTagOptions, setLeadTagOptions] = useState<OptionType[]>([]);
  const [customer, setCustomer] = useState<CustomerDataInterface>(
    editData?.customer
  );
  const { data: leadTypeData } = useQuery({
    queryKey: ["leadTypeData"],
    queryFn: async () => await getLeadTypes(),
  });
  const { mutate: addLeadTagHandler } = useMutation({
    mutationFn: (data: any) => {
      return addLeadTag(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leadTagData"],
      });
    },
  });
  const { data: leadTagData } = useQuery({
    queryKey: ["leadTagData"],
    queryFn: async () => await getLeadTags(),
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
  useEffect(() => {
    if (leadTagData && leadTagData?.data?.length > 0) {
      const leadTags = leadTagData.data.map((leadTag: any) => ({
        label: leadTag.title,
        value: leadTag.title,
      }));
      setLeadTagOptions(leadTags);
    }
  }, [leadTagData]);
  const formik = useFormik({
    initialValues: {
      leadType: editData?.leadType,
      leadTag: editData?.leadTag,
      leadTemperature: editData?.leadTemperature,
      description: editData?.body,
      leadResponsible: userData?.fullName,
    },
    enableReinitialize: true,
    onSubmit: async () => {},
  });
  const { mutate: editLeadHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editLead(id, data);
    },
    onSuccess: () => {
      setOpenModal(false);
      formik.resetForm();
      dispatch(
        fetchLeads({
          page: currentPage,
          limit: limit,
          filters: filters,
        })
      );
    },
  });
  function submitForm() {
    let data;
    if (customer?.id) {
      data = {
        lead: {
          leadTypeId: Number(formik.values.leadType),
          body: formik.values.description,
          temperature: formik.values.leadTemperature,
          tags: formik.values.leadTag,
          customerId: customer?.id,
        },
      };
    } else {
      data = {
        lead: {
          leadTypeId: Number(formik.values.leadType),
          body: formik.values.description,
          temperature: formik.values.leadTemperature,
          tags: formik.values.leadTag,
        },
        person: {
          isMainCustomer: false,
          firstName: customer?.firstName,
          lastName: customer?.lastName,
          idNumber: customer?.idNumber,
        },
      };
    }

    editLeadHandler({ id: editData?.id, data: data });
  }
  return (
    <>
      <Button
        className="border-none p-0 text-[#212B36]"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Image
          src="/icons/edit-primary.png"
          alt=""
          width={1024}
          height={1024}
          className="w-4 h-4"
          onClick={() => {}}
        />
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="ویرایش درخواست"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">ویرایش درخواست</span>
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
              key: "leadType",
              component: "Select",
              placeholder: "نوع درخواست",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full",
              options: leadTypeOptions,
            },
            {
              key: "leadResponsible",
              component: "input",
              placeholder: "مسئول پیگیری",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full",
              readonly: true,
              disabled: true,
              defaultValue: userData.fullName,
            },
            {
              key: "leadTag",
              component: "multi-select",
              placeholder: "برچسب",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full",
              options: leadTagOptions,
              isValidNewOption: true,
              sendValue: (value: string) => addLeadTagHandler({ title: value }),
            },
            {
              key: "leadTagPreview",
              component: "tag-preview",
              dependantKey: "leadTag",
              className: "w-full",
            },
            {
              key: "leadTemperature",
              component: "selectable-tag-input",
              options: [
                {
                  label: "سرد",
                  value: "COLD",
                  className: "bg-[#F2F7FE] text-[#1C68DA]",
                  activeClassName: "border border-[#1C68DA]",
                },
                {
                  label: "گرم",
                  value: "WARM",
                  className: "bg-[#FFFAEB] text-[#F79009]",
                  activeClassName: "border border-[#DC6803]",
                },
                {
                  label: "داغ",
                  value: "HOT",
                  className: "bg-[#FEF3F2] text-[#F04438]",
                  activeClassName: "border border-[#F04438]",
                },
              ],

              className: "w-full",
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
          className="flex flex-row w-full"
        />
        <AddCustomerToLeadContainer
          onSendSelectedCustomer={(selectedCustomer: CustomerDataInterface) => {
            console.log(selectedCustomer);
            setCustomer(selectedCustomer);
          }}
          onSendCustomerData={(customerData: CustomerDataInterface) => {
            setCustomer(customerData);
          }}
        />
        {customer && (
          <div className="p-2">
            <CustomerCard {...customer} />
          </div>
        )}

        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              setOpenModal(false);
              submitForm()
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
    </>
  );
}

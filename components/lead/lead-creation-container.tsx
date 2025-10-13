import { Button } from "../ui/button";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker, { OptionType } from "../shared/form-maker";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLead, addLeadTag, getLeadTags, getLeadTypes } from "@/api/lead";

import { fetchLeads } from "@/store/lead-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

import AddCustomerToLeadContainer from "./AddCustomerToLeadContainer";
import { CustomerDataInterface } from "../service/customer-infinite-card";
import CustomerCard from "../share/customer/CustomerCard";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { pagesData } from "@/constants/pages-data";
import { AccessDenied } from "../shared/AccessDenied";
import Image from "next/image";

export default function LeadCreationContainer() {
  const pageFeatures = usePageData();

  const queryClient = useQueryClient();
  const dispatch = useDispatch<any>();
  const userData = useSelector((state: RootState) => state.login);
  const limit = useSelector((state: any) => state.lead.limit);
  const filters = useSelector((state: any) => state.lead.limit);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [leadTypeOptions, setLeadTypeOptions] = useState<OptionType[]>([]);
  const [leadTagOptions, setLeadTagOptions] = useState<OptionType[]>([]);
  const [customer, setCustomer] = useState<CustomerDataInterface>();
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
      leadType: "",
      leadTag: [],
      leadTemperature: "",
      description: "",
      leadResponsible: userData?.fullName,
    },
    onSubmit: async () => { },
  });

  const { mutate: addLeadHandler } = useMutation({
    mutationFn: (data: any) => {
      return addLead(data);
    },
    onSuccess: () => {
      setOpenModal(false);
      formik.resetForm();
      dispatch(
        fetchLeads({
          page: 1,
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

    addLeadHandler(data);
  }

  return (
    <>
      {generateFeatureAccess(pageFeatures, "code")?.show &&
        generateFeatureAccess(pagesData, "")?.enable && (
          <Button
            variant={"info"}
            onClick={() => {
              setOpenModal(true);
            }}
          // className={cn("text-aqua-foreground flex justify-end w-full")}
          >
            درخواست جدید
          </Button>
        )}

      {!generateFeatureAccess(pageFeatures, "export-lead")?.show &&
        !generateFeatureAccess(pagesData, "export-lead")?.enable && (
          <AccessDenied
            featureCode="export-lead"
            variant={""}
            title=" درخواست جدید "
            message="شما به این بخش دسترسی ندارید"
            icon={
              <Image
                src={"/icons/disable-download.png"}
                alt="edit"
                width={1024}
                height={1024}
                className="w-4 h-4"
              />
            }
          />
        )}

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
              formik.resetForm();
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
              defaultValue: userData?.fullName,
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
                  className: "bg-static-info-light text-static-info-primary",
                  activeClassName: "border border-static-info-primary",
                },
                {
                  label: "گرم",
                  value: "WARM",
                  className: "bg-static-warning-light text-static-warning-primary",
                  activeClassName: "border border-static-warning-border",
                },
                {
                  label: "داغ",
                  value: "HOT",
                  className: "bg-static-error-light text-static-error-primary",
                  activeClassName: "border border-static-error-primary",
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

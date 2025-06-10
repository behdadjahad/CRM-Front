import FormMaker from "@/components/shared/form-maker";

import { cleanFormatPrice, cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { editVisaData, sendVisaData } from "@/api/visa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ServiceCustomerManager from "../service-customer-manager";
import Image from "next/image";
import { deleteServiceCustomerData } from "@/api/customer-service";

export default function VisaForm({
  visa,
  onRemoveHandler,
  itemId,
  currencies,
  countries,
  visaTypes,
  visaDurationTypes,
  visaEntranceTypes,
  customers,
}: any) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      id: visa?.id,
      isSubmitted: visa?.isSubmitted,
      visaType: visa?.visaType?.toString(),
      country: visa?.country?.toString(),
      // clientName: visa?.customerSoldToId?.toString(),
      visaTime: visa?.visaTime?.toString(),
      currency: visa?.currency?.toString(),
      description: visa?.description,
      visaCost: visa?.visaCost ? formatPrice(visa?.visaCost) : "",
      visaApproval: visa?.visaApproval?.toString(),
      //visaFile: visa?.files,
    },

    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function removeForm(formId: string) {
    onRemoveHandler(formId);
  }
  const { mutate: visaSubmitter } = useMutation({
    mutationFn: (data: any) => {
      return sendVisaData(data, Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["submittedVisa"] });
    },
  });
  const { mutate: visaEditor } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editVisaData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["submittedVisa"] });
    },
  });

  function submitForm(data: any) {
    if (data.isSubmitted) {
      visaEditor({
        data: {
          files: data.visaFile,
          description: data.description,
          // customerSoldToId: data.clientName,
          countryId: data.country,
          priceWeBuy: cleanFormatPrice(data.visaCost),
          currencyWeBuyId: data.currency,
          visaEntranceTypeId: data.visaApproval,
          visaDurationTypeId: data.visaTime,
          visaTypeId: data.visaType,
        },
        id: data.id,
      });
    } else {
      visaSubmitter({
        files: data.visaFile,
        description: data.description,
        // customerSoldToId: data.clientName,
        countryId: data.country,
        priceWeBuy: cleanFormatPrice(data.visaCost),
        currencyWeBuyId: data.currency,
        visaEntranceTypeId: data.visaApproval,
        visaDurationTypeId: data.visaTime,
        visaTypeId: data.visaType,
      });
    }
  }
  const { mutate: deleteCustomerService } = useMutation({
    mutationFn: (data: any) => {
      return deleteServiceCustomerData(data, Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submittedVisa"] });
    },
  });
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border border-gray-400 rounded-md p-3"
      )}
    >
      <div className="flex flex-row items-center  p-2 justify-between">
        <h2>ویزا</h2>
        <ServiceCustomerManager entityId={visa?.id} />
      </div>

      <FormMaker
        form={formik}
        fields={[
          {
            key: "visaType",
            component: "Select",
            placeholder: "نوع ویزا",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: visaTypes,
          },
          {
            key: "country",
            component: "Select",
            placeholder: "کشور",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: countries,
          },
          // {
          //   key: "clientName",
          //   component: "Select",
          //   placeholder: "نام مشتری",
          //   type: "text",
          //   floating: true,
          //   className: "w-full md:w-1/3",
          //   options: customers,
          // },
          {
            key: "visaTime",
            component: "Select",
            placeholder: "مدت زمان ویزا",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: visaDurationTypes,
          },
          {
            key: "visaCost",
            component: "input",
            placeholder: " هزینه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            formatted: true,
          },
          {
            key: "currency",
            component: "Select",
            placeholder: "ارز هزینه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: currencies,
          },
          {
            key: "visaApproval",
            component: "Select",
            placeholder: " نوع ویزا (تعداد ورود-خروج) ",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: visaEntranceTypes,
          },
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            className: "w-full",
          },
          {
            key: "visaFile",
            component: "file",
            placeholder: "",
            type: "file",
            floating: true,
            icon: "/icons/vector.png",
            className: "w-full",
          },
          {
            component: "file-preview",
            key: "filePreview",
            dependantKey: "visaFile",
            className: "w-full",
          },
          {
            component: "non-field",
            key: "actions",
            children: (
              <div className="flex flex-row items-center gap-2 justify-end w-full">
                <Button
                  variant="info"
                  onClick={() => {
                    submitForm(formik.values);
                  }}
                >
                  ثبت ویزا
                </Button>
                <Button
                  onClick={() => {
                    removeForm(itemId);
                  }}
                  className="text-danger border-danger"
                >
                  حذف ویزا
                </Button>
              </div>
            ),
          },
        ]}
        className=""
      />
      {visa?.customers?.length > 0 && (
        <div className="flex flex-col gap-2 border border-gray-400 rounded-md p-3">
          <h2> لیست مشتری </h2>
          {visa?.customers?.length > 0 &&
            visa?.customers?.map((customer: any) => (
              <div className="flex justify-between items-center w-full gap-4">
                <div
                  key={customer.id}
                  className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between w-full bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {" "}
                      <div className="rounded-full flex items-center justify-center bg-[#F5F5F5] border border-gray-200 w-10 h-10">
                        <Image
                          src={"/icons/customer.png"}
                          alt="edit"
                          width={18}
                          height={18}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-primary-bold">
                          <>{customer.firstName + " " + customer.lastName}</>
                        </span>

                        <span className="text-sm text-foreground-mute">
                          {customer?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-foreground-mute gap-2">
                    <Image
                      src={"/icons/customerMobile.png"}
                      alt="edit"
                      width={12}
                      height={12}
                    />
                    <span>{customer?.phone}</span>
                  </div>
                  <div className="flex items-center text-foreground-mute gap-2">
                    <Image
                      src={"/icons/customerID.png"}
                      alt="edit"
                      width={18}
                      height={18}
                    />
                    <span>{customer.idNumber}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const data = {
                      avService: "Visa",
                      customerIds: [customer.customerId],
                      entityId: visa?.id,
                    };
                    deleteCustomerService(data);
                  }}
                  className="text-danger border-danger"
                >
                  حذف
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

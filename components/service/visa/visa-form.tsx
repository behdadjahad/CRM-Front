import FormMaker from "@/components/shared/form-maker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { editVisaData, sendVisaData } from "@/api/visa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function VisaForm({
  visa,
  onRemoveHandler,
  itemId,
  currencies,
  countries,
  customers,
  visaTypes,
  visaDurationTypes,
  visaEntranceTypes,
}: any) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      id: visa?.id,
      isSubmitted: visa?.isSubmitted,
      visaType: visa?.visaType?.toString(),
      country: visa?.country?.toString(),
      clientName: visa?.customerSoldToId?.toString(),
      visaTime: visa?.visaTime?.toString(),
      currency: visa?.currency?.toString(),
      description: visa?.description,
      visaCost: visa?.visaCost,
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
    },
  });
  const { mutate: visaEditor } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editVisaData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });

  function submitForm(data: any) {
 
    if (data.isSubmitted) {
      visaEditor({
        data: {
          files: data.visaFile,
          description: data.description,
          customerSoldToId: data.clientName,
          countryId: data.country,
          priceWeBuy: data.visaCost,
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
        customerSoldToId: data.clientName,
        countryId: data.country,
        priceWeBuy: data.visaCost,
        currencyWeBuyId: data.currency,
        visaEntranceTypeId: data.visaApproval,
        visaDurationTypeId: data.visaTime,
        visaTypeId: data.visaType,
      });
    }
  }
  return (
    <div className={cn("flex flex-col gap-4")}>
      <div className="flex flex-row items-center gap-4 p-2">
        <h2>ویزا</h2>
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
          {
            key: "clientName",
            component: "Select",
            placeholder: "نام مشتری",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: customers,
          },
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
    </div>
  );
}

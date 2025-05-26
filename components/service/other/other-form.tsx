import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cleanFormatPrice, formatPrice, REQUIRED_TEXT } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import * as Yup from "yup";
import { useParams } from "next/navigation";
import { editOtherData, sendOtherData } from "@/api/other";
import { current } from "@reduxjs/toolkit";
export default function OtherContainer({
  itemId,
  onRemoveHandler,
  other,
  currencies,
}: {
  itemId: any;
  onRemoveHandler: any;
  other: any;
  currencies: any;
}) {
  // const [otherId, setOtherId] = useState<number>();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      id: other?.id,
      title: other?.title,
      description: other?.description,
      otherFile: other?.files,
      isSubmitted: other.isSubmitted,
      cost: other?.cost ? formatPrice(other?.cost):"",
      currency: other?.currency,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(REQUIRED_TEXT),
    }),

    onSubmit: async () => {},
    enableReinitialize: true,
  });
  function removeForm(formId: string) {
    onRemoveHandler(formId);
  }

  const { mutate: otherSubmitter } = useMutation({
    mutationFn: (data: any) => {
      return sendOtherData(data, Number(id));
    },
    onSuccess: () => {
      // setOtherId(data.id);
      queryClient.invalidateQueries({
        queryKey: ["submittedOthers"],
      });
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });

  const { mutate: otherEditor } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editOtherData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submittedOthers"],
      });
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  function submitForm(data: any) {
    if (data.isSubmitted) {
      otherEditor({
        data: {
          title: data.title,
          description: data.description,
          files: data.otherFile,
          priceWeBuy: cleanFormatPrice(data.cost),
          currencyWeBuyId: data.currency,
        },
        id: data.id,
      });
    } else {
      otherSubmitter({
        title: data.title,
        description: data.description,
        files: data.otherFile,
        priceWeBuy: cleanFormatPrice(data.cost),
        currencyWeBuyId: data.currency,
      });
    }
  }
  return (
    <div className="bg-card flex flex-col gap-4 border border-gray-400 rounded-md p-3">
      <h2>سایر </h2>
      <FormMaker
        form={formik}
        fields={[
          {
            key: "title",
            component: "input",
            placeholder: "عنوان",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
          },
          {
            key: "description",
            component: "input",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            className: "w-full md:w-2/3",
          },
          {
            key: "otherFile",
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
            dependantKey: "otherFile",
            className: "w-full",
          },
          {
            component: "non-field",
            key: "title",
            children: (
              <h2 className="w-full border-t-4 border-dashed pt-3">خرید</h2>
            ),
          },

          {
            key: "cost",
            component: "input",
            placeholder: "هزینه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            formatted:true
          },

          {
            key: "currency",
            component: "Select",
            placeholder: "ارزهزینه",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
            options: currencies,
          },
          {
            key: "broker",
            component: "Select",
            placeholder: "کارگزار",
            type: "text",
            floating: true,
            className: "w-full md:w-1/3",
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
                  ثبت
                </Button>
                <Button
                  onClick={() => {
                    removeForm(itemId);
                  }}
                  className="text-danger border-danger"
                >
                  حذف
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

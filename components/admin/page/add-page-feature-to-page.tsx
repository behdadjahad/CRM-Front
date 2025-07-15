import { addPageFeature } from "@/api/admin";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export interface AddPageFeatureToPageInterface {
  pageId: number;
}

export default function AddPageFeatureToPage({
  pageId,
}: AddPageFeatureToPageInterface) {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      pageId: pageId,
      name: "",
      code: "",
      description: "",
      urlPattern: [],
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const { mutate: addPageFeatureHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPageFeature(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageData"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  function addPageFeatureToPageHandler(values: any) {
    const data = {
      pageId: values.pageId,
      name: values.name,
      code: values.code,
      description: values.description,
      urlPattern: values.urlPattern,
    };
    addPageFeatureHandler(data);
  }
  return (
    <div className="flex items-center justify-between flex-col gap-4">
      <Button
        variant={"transparent"}
        onClick={() => {
          setOpenModal(true);
        }}
        className={cn("text-aqua-foreground text-xs")}
      >
        <FaPlus />
        افزودن ویژگی به صفحه
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=" افزودن ویژگی به صفحه"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن ویژگی به صفحه</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div>
          {" "}
          <FormMaker
            form={formik}
            fields={[
              {
                key: "name",
                component: "input",
                placeholder: "نام",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "code",
                component: "input",
                placeholder: "کد",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "description",
                component: "input",
                placeholder: "توضیحات",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "urlPattern",
                component: "multi-added-input",
                placeholder: "آدرس ها",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
            ]}
            className="flex flex-row w-full"
          />
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addPageFeatureToPageHandler(formik.values);
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
    </div>
  );
}

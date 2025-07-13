import { addCategorytoPackage, getPackageCategory } from "@/api/admin";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
export interface AddCategoryToPackageInterface {
  packageId: number;
}
export default function AddCategoryToPackage({
  packageId,
}: AddCategoryToPackageInterface) {
  const queryClient = useQueryClient();
  const { data: categoryData } = useQuery({
    queryKey: ["categoryData"],
    queryFn: async () => await getPackageCategory(),
  });
  const { categoryList } = getData(categoryData);
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      packageId: packageId,
      categories: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const { mutate: addCategoryhandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return addCategorytoPackage(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  function addCatogoryToPackagehandler(values: any) {
    const id = values.packageId;
      const data = { ids:values.categories };
    addCategoryhandler({
      id: id,
      data: data,
    });
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
        افزودن دسته بندی به پکیج
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="700px"
        minHeight="400px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="افزودن دسته بندی به پکیج"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن دسته بندی</span>
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
                key: "categories",
                component: "multi-select",
                placeholder: "دسته بندی",
                type: "text",
                className: "w-full md:w-1/2",
                options: categoryList,
              },
            ]}
            className="flex flex-row w-full"
          />
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addCatogoryToPackagehandler(formik.values);
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
function getData(categoryData: any) {
  const categoryList = categoryData?.data?.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  return { categoryList };
}

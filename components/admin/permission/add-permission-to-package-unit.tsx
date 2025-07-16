import {
  addCategorytoPackage,
  addPermissionToPackageUnit,
  addPermissionToRole,
  getPackageCategory,
  getPermission,
} from "@/api/admin";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
export interface AddPermissionToPackageUnitInterface {
  packageUnitId: number;
}
export default function AddPermissionToPackageUnit({
  packageUnitId,
}: AddPermissionToPackageUnitInterface) {

  const queryClient = useQueryClient();
  const { data: permissionData } = useQuery({
    queryKey: ["permissionData"],
    queryFn: async () => await getPermission(),
  });
  const { permissionList } = getData(permissionData);
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      packageUnitId: packageUnitId,
      permissions: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const { mutate: addPermissionhandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return addPermissionToPackageUnit(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roleData"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  function addPermissionToPackageUnitHandler(values: any) {
    const id = values.packageUnitId;
    const data = { ids: values.permissions };
    addPermissionhandler({
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
        افزودن دسترسی به واحدپکیج
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="افزودن دسترسی به واحد پکیج"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن دسترسی به واحد پکیج</span>
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
                key: "permissions",
                component: "multi-select",
                placeholder: "دسترسی ها را انتخاب کنید",
                type: "text",
                className: "w-full md:w-1/2",
                options: permissionList,
              },
            ]}
            className="flex flex-row w-full"
          />
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addPermissionToPackageUnitHandler(formik.values);
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
function getData(permissionData: any) {
  const permissionList = permissionData?.data?.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  return { permissionList };
}

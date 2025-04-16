"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerData, editCustomerData } from "@/api/customer";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";

export interface ClientInfoCardInterface {
  data: {
    label: string;
    value: string;
  }[];
  action: {
    label?: string;
    icon: {
      src: string;
      className?: string;
    };
    click: () => any;
  }[];
  clientServices: {
    label?: string;
    icon: string;
    iconClassName?: string;
  }[];
}

export default function ClientInfoCard({
  clientData,
  clientId,
  clientInfo,
}: {
  clientData: any[];
  clientId: number;
  clientInfo: any;
}) {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      clientName: clientInfo?.name,
      clientFamily: clientInfo?.family,
      clientSSD: clientInfo?.ssd,
      clientPhoneNumber: clientInfo?.phone,
      clientEmail: clientInfo?.email,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const [openModal, setOpenModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { mutate: deleteCustomerHandler } = useMutation({
    mutationFn: (id: number) => {
      return deleteCustomerData(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contractCustomersData"],
      });
    },
  });
  const { mutate: editCustomerHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editCustomerData(id, data);
    },
    onSuccess: () => {
      setOpenModal(false);
    },
  });

  return (
    <div className="flex flex-col rounded-lg overflow-hidden  items-start border border-border/20  border-r-primary border-r-[6px]">
      <div
        className={`flex w-full p-2 overflow-hidden ${
          isCollapsed ? "h-[150px]" : "h-[75px]"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="w-4/5 flex flex-col gap-1">
          {clientData.map(
            (item: any, index: number) =>
              index > 0 && (
                <div key={item.label} className="flex flex-row">
                  <span className="text-subtitle/80 text-xs w-1/2">
                    {item.label}
                  </span>
                  <span className="text-xs w-1/2">{item.value}</span>
                </div>
              )
          )}
        </div>

        <div className="w-1/5 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-0.5">
            <Button variant={"transparent"} className="p-0">
              <Image
                src="/icons/trash.png"
                alt=""
                width={1024}
                height={1024}
                className="w-5 h-5"
                onClick={() => {
                  deleteCustomerHandler(clientId);
                }}
              />
            </Button>
            <Button variant={"transparent"} className="p-0">
              <Image
                src="/icons/edit-primary.png"
                alt=""
                width={1024}
                height={1024}
                className="w-4 h-4"
                onClick={() => setOpenModal(true)}
              />
            </Button>
            <CustomModal
              minWidth="0"
              maxWidth="700px"
              isOpen={openModal}
              onRequestClose={() => setOpenModal(false)}
              contentLabel="ویرایش مشتری"
            >
              <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
                <span className="text-lg font-bold">ویرایش مشتری</span>
                <MdClose
                  size={20}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className="cursor-pointer"
                />
              </div>
              <div className="w-full flex flex-col items-end gap-8">
                <FormMaker
                  form={formik}
                  fields={[
                    {
                      key: "clientName",
                      component: "input",
                      placeholder: "نام",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientFamily",
                      component: "input",
                      placeholder: "نام خانوادگی",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientSSD",
                      component: "input",
                      placeholder: "کدملی",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientPhoneNumber",
                      component: "input",
                      placeholder: "شماره تماس",
                      type: "text",
                      floating: true,
                      className: "w-full md:w-1/2",
                    },
                    {
                      key: "clientEmail",
                      component: "input",
                      placeholder: "ایمیل",
                      type: "text",
                      floating: true,
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
                    editCustomerHandler({
                      id: clientInfo.id,
                      data: {
                        firstName: formik.values.clientName,
                        lastName: formik.values.clientFamily,
                        idNumber: formik.values.clientSSD,
                        phoneNumber: formik.values.clientPhoneNumber,
                        email: formik.values.clientEmail,
                      },
                    });
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
        </div>
      </div>
      <Button
        variant={"transparent"}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-xs text-foreground">
          {" "}
          {isCollapsed ? "کمتر" : "بیشتر"}
        </span>

        {isCollapsed ? <FaChevronDown size={8} /> : <FaChevronUp size={8} />}
      </Button>
    </div>
  );
}

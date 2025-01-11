"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { FaPlus } from "react-icons/fa";
import ServiceCard, { ServiceCardInterface } from "../shared/service-card";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "@/store/user-slice";

export interface ContractCreationInterface {
  formServices: ServiceCardInterface[];
}

export default function ContractCreation({
  formServices,
}: ContractCreationInterface) {
  const [openModal, setOpenModal] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData() as any);
  }, [dispatch, userData]);
  const formik = useFormik({
    initialValues: {
      number: "",
      contractDate: "",
      submitter: "",
      accountant: "",
      description: "",
    },
    onSubmit: async () => {},
  });

  return (
    <>
      <Button variant={"info"} onClick={() => setOpenModal(true)}>
        <FaPlus size={16} />

        <span>قرارداد جدید</span>
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="ویرایش"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">ثبت قرارداد</span>

          <MdClose
            size={20}
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-3 text-base">
            <span>موضوع قرارداد</span>
            <div className="flex flex-row flex-wrap items-center gap-3 w-full">
              {formServices.map((item) => (
                <ServiceCard
                  key={item.title}
                  {...item}
                  clickFunction={() =>
                    activeItem && activeItem.title === item.title
                      ? setActiveItem(null)
                      : setActiveItem(item)
                  }
                  isActive={activeItem && activeItem.title == item.title}
                  className="min-w-18 w-18 max-w-18 h-auto text-[8px] text-right items-start "
                  imageClassName="min-w-0 h-15"
                />
              ))}
            </div>
          </div>

          <FormMaker
            form={formik}
            fields={[
              {
                key: "number",
                component: "input",
                placeholder: "شماره قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                readonly: true,
              },
              {
                key: "contractDate",
                component: "date",
                placeholder: "تاریخ قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "submitter",
                component: "input",
                placeholder: "ثبت کننده",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                defaultValue: userData.fullName,
              },
              {
                key: "accountant",
                component: "input",
                placeholder: "مسئول قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
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

          <div className="flex flex-row gap-4">
            <Button variant={"info"}>ثبت و جدید</Button>
            <Button variant={"info"}>ثبت و تکمیل</Button>
            <Button variant={"foreground"} onClick={() => setOpenModal(false)}>
              لغو
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

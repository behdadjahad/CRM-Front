"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import FormMaker from "./form-maker";
import { cn } from "@/lib/utils";
import CustomModal from "./custom-modal";
import Image from "next/image";

export interface SearchInterface {
  className?: string;
}

export default function Search({ className }: SearchInterface) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={cn(className)}>
      <SearchInput className="hidden lg:flex w-[450px] mr-auto" />

      <div
        className="bg-badge p-2 rounded-lg flex flex-row items-center justify-center gap-3 outline-none h-10 w-10 lg:hidden"
        onClick={() => setOpenModal(true)}
      >
        <Image
          src={"/icons/search.png"}
          alt="جست و جو"
          width={22}
          height={22}
        />
      </div>

      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="جست و جو"
      >
        <SearchInput />
      </CustomModal>
    </div>
  );
}

function SearchInput({ className }: SearchInterface) {
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: async () => {},
  });

  return (
    <FormMaker
      form={formik}
      fields={[
        {
          key: "search",
          component: "input",
          placeholder: "جستجو",
          icon: "/icons/search.png",
          type: "text",
          floating: false,
          className: "col-span-12",
          labelClassName: "bg-badge",
        },
      ]}
      className={cn("flex flex-row w-full", className)}
    />
  );
}

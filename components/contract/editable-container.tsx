"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import { ContractOutput } from "@/api/contract";
import { getUsers } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { getCities, getCountries } from "@/api/location";

export interface EditableContainerInterface {
  list: {
    label: string;
    value: string;
  }[];
  action: {
    label: string;
    icon: React.ReactNode;
    click: () => any;
  };
  contract: ContractOutput;
}

export default function EditableContainer({
  action,
  list,
  contract,
}: EditableContainerInterface) {
  const [openModal, setOpenModal] = useState(false);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });

  useEffect(() => {
    if (users) {
      const userOption: OptionType[] = users.map((item) => ({
        label: item.fullName,
        value: item.id.toString(),
      }));
      setUserOptions(userOption);
    }
  }, [users]);

  const formik = useFormik({
    initialValues: {
      number: contract?.contractNo ?? "",
      date: contract?.contractDate ?? "",
      subject: contract?.contractType?.name ?? "",
      accountant: contract?.userResponsible?.id.toString() ?? "",
      description: contract?.description ?? "",
      country: contract?.destinationCountry?.toString() ?? "",
      city: contract?.destinationCity?.toString() ?? "",
    },
    onSubmit: async () => {},
  });

  const { data: countryData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => await getCountries(),
  });
  const { data: cityData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => await getCities(),
  });
  useEffect(() => {
    if (countryData) {
      const countryOptions: OptionType[] = countryData?.data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setCountryOptions(countryOptions);
    }
  }, [countryData]);

  useEffect(() => {
    if (cityData) {
      if (!formik.values.country) {
        const cities: OptionType[] = cityData?.data.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setCityOptions(cities);
      } else {
        const cities: OptionType[] = cityData?.data
          ?.filter((item) => item.countryId === Number(formik.values.country))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setCityOptions(cities);
      }
    }
  }, [cityData, formik.values.country]);

  return (
    <>
      <div className="w-full bg-city bg-cover rounded-xl p-6 md:p-8 text-primary-foreground flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {list.map((item, index) => (
            <div
              key={item.label}
              className="flex flex-row gap-4 md:gap-8 items-start"
            >
              <div
                className={cn(
                  "flex flex-row flex-wrap md:flex-col items-center justify-between md:items-start w-full gap-2.5",
                  {
                    "border-b pb-2 -mb-2 md:mb-0 md:pb-0 border-dashed border-primary-foreground flex md:border-none":
                      index == 0,
                  }
                )}
              >
                <span className="text-base font-normal">{item.label}</span>

                <span
                  className={cn("font-bold", {
                    "w-full": index == list.length - 1,
                  })}
                >
                  {item.value}
                </span>
              </div>

              {index == 0 && (
                <span
                  key={index + item.label}
                  className="h-full border-l border-dashed border-primary-foreground hidden md:flex"
                />
              )}
            </div>
          ))}
        </div>

        <Button
          variant={"transparent"}
          onClick={() => {
            setOpenModal(true);
            action.click();
          }}
          className="gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      </div>

      <CustomModal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="ویرایش"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span>ویرایش</span>

          <MdClose
            size={20}
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full flex flex-col items-end">
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
              },
              {
                key: "date",
                component: "date",
                placeholder: "تاریخ قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "subject",
                component: "input",
                placeholder: "موضوع قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "accountant",
                component: "Select",
                placeholder: "مسئول قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                options: userOptions,
              },
              {
                key: "country",
                component: "Select",
                placeholder: "کشور",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                options: countryOptions,
              },
              {
                key: "city",
                component: "Select",
                placeholder: "شهر",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
                options: cityOptions,
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
            <Button variant={"info"}>ثبت</Button>
            <Button variant={"foreground"} onClick={() => setOpenModal(false)}>
              لغو
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

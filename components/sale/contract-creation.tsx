"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/shared/custom-modal";
import { MdClose } from "react-icons/md";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { FaPlus } from "react-icons/fa";
import ServiceCard, { ServiceCardInterface } from "../shared/service-card";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "@/store/user-slice";
import {
  createContract,
  getContractNumber,
} from "@/api/contract";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/auth";
import { useRouter } from "next/navigation";

import { getCities, getCountries } from "@/api/location";
import { convertToGregorian } from "@/lib/date";

export interface ContractCreationInterface {
  contractTypes: ServiceCardInterface[];
}

export default function ContractCreation({
  contractTypes,
}: ContractCreationInterface) {
  const [openModal, setOpenModal] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);

  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      contractId: undefined,
      number: "",
      contractDate: "",
      contractDateType: "",
      submitter: "",
      accountant: "",
      description: "",
      country: undefined,
      city:undefined ,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
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
          ?.filter((item) => item.countryId === formik.values.country)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setCityOptions(cities);
      }
    }
  }, [cityData, formik.values.country]);

  useEffect(() => {
    if (users) {
      const userOption: OptionType[] = users.map((item) => ({
        label: item.fullName,
        value: item.id.toString(),
      }));
      setUserOptions(userOption);
    }
  }, [users]);

  useEffect(() => {
    dispatch(fetchUserData() as any);
  }, [dispatch, userData]);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (id: number) => {
      return getContractNumber(id);
    },
    onSuccess: ({ data }) => {
   
      formik.setFieldValue("contractId", data?.contractId);
      formik.setFieldValue("number", data?.suggestedContractNo);
    },
  });

  const { mutate: createContractMutation } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return createContract(id, data);
    },
    onSuccess: ({ data }) => {
      setOpenModal(false);
      formik.resetForm();
      setActiveItem(null);
      router.push(`/contract/${data.id}`);
    },
  });
  const { mutate: createContractMutationn } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return createContract(id, data);
    },
    onSuccess: () => {
      formik.resetForm();
      setActiveItem(null);
  },
  });
  function contractSubmitHandler(enableNewCreation: boolean) {
    if (!formik.values.contractId) return;
    const id = formik.values.contractId;
    const data = {
      contractTypeId: activeItem.id,
      contractDate: convertToGregorian(
        formik.values.contractDate,
        formik.values.contractDateType
      ),
      dateType: formik.values.contractDateType,
      description: formik.values.description,
      userSubmitterId: userData.id,
      userResponsibleId: Number(formik.values.accountant),
      destinationCityId: formik.values.city,
      destinationCountryId: formik.values.country,
    };
    if (enableNewCreation) {
      createContractMutationn({
        id: id,
        data: data,
      });
    } else {
      createContractMutation({
        id: id,
        data: data,
      });
    }
  }

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
        overflow="visible"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-3">
          <span className="text-lg font-bold">ثبت قرارداد</span>

          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
              formik.resetForm();
              setActiveItem(null);
            }}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 text-base">
            <span>موضوع قرارداد</span>
            <div className="flex flex-row flex-wrap items-center gap-2 w-full">
              {contractTypes.map((item) => (
                <ServiceCard
                  key={item.id}
                  {...item}
                  clickFunction={() => {
                    if (activeItem && activeItem.title === item.title) {
                      setActiveItem(null);
                      formik.setFieldValue("number", " ");
                    } else {
                      setActiveItem(item);
                      mutate(item.id);
                    }
                  }}
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
                disabled: true,
                defaultValue: formik.values.number,
              },
              {
                key: "contractDate",
                dependantKey: "contractDateType",
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

          <div className="flex flex-row gap-2">
            <Button
              variant={"info"}
              onClick={() => {
                contractSubmitHandler(true);
              }}
            >
              ثبت و جدید
            </Button>
            <Button
              variant={"info"}
              onClick={() => {
                contractSubmitHandler(false);
              }}
            >
              ثبت و تکمیل
            </Button>
            <Button
              variant={"foreground"}
              onClick={() => {
                setOpenModal(false);
                formik.resetForm();
                setActiveItem(null);
              }}
            >
              لغو
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

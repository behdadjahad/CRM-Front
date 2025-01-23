/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Breadcrumb from "@/components/shared/breadcrumb";
import EditableContainer from "@/components/contract/editable-container";
import ServiceContainer from "@/components/shared/service-container";
import Title from "@/components/shared/title";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useEffect, useState } from "react";
import RegisteryForm from "@/components/contract/registery-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getContractById } from "@/api/contract";
import { useParams } from "next/navigation";
import { services } from "@/constants/services";
import FormTabContainer from "@/components/shared/form-tab-container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { REQUIRED_TEXT } from "@/lib/utils";
import { createFormFields } from "@/constants/client-form-fields";
import { createClient } from "@/api/client";
import { getCities, getCountries } from "@/api/location";
import { OptionType } from "@/components/shared/form-maker";

export default function Contract() {
  const [category, setCategory] = useState("personal");
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const { id } = useParams();

  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(id as any),
  });
  const personalFormik = useFormik({
    initialValues: {
      name: "",
      familyName: "",
      birthdate: "",
      socialNumber: "",
      idNumber: "",
      career: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(REQUIRED_TEXT),
      familyName: Yup.string().required(REQUIRED_TEXT),
      birthdate: Yup.string().required(REQUIRED_TEXT),
      socialNumber: Yup.string().required(REQUIRED_TEXT),
      idNumber: Yup.string().required(REQUIRED_TEXT),
      career: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => {},
  });

  // const livingContactFormik = useFormik({
  //   initialValues: {
  //     personalPhone: "",
  //     homePhone: "",
  //     email: "",
  //     website: "",
  //   },
  //   validationSchema: Yup.object().shape({
  //     personalPhone: Yup.string().required(REQUIRED_TEXT),
  //     homePhone: Yup.string().required(REQUIRED_TEXT),
  //     email: Yup.string().required(REQUIRED_TEXT),
  //     website: Yup.string().required(REQUIRED_TEXT),
  //   }),
  //   onSubmit: () => {},
  // });

  // const workContactFormik = useFormik({
  //   initialValues: {
  //     jobPhone: "",
  //     email: "",
  //     website: "",
  //   },
  //   validationSchema: Yup.object().shape({
  //     jobPhone: Yup.string().required(REQUIRED_TEXT),
  //     email: Yup.string().required(REQUIRED_TEXT),
  //     website: Yup.string().required(REQUIRED_TEXT),
  //   }),
  //   onSubmit: () => {},
  // });

  const livingFormik = useFormik({
    initialValues: {
      province: "",
      city: "",
      street: "",
      postalCode: "",
      category: "",
      address: "",
      country: undefined,
    },
    validationSchema: Yup.object().shape({
      province: Yup.string().required(REQUIRED_TEXT),
      city: Yup.string().required(REQUIRED_TEXT),
      street: Yup.string().required(REQUIRED_TEXT),
      postalCode: Yup.string().required(REQUIRED_TEXT),
      category: Yup.string().required(REQUIRED_TEXT),
      address: Yup.string().required(REQUIRED_TEXT),
      country: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => {},
  });

  // const workFormik = useFormik({
  //   initialValues: {
  //     workProvince: "",
  //     workCity: "",
  //     WorkStreet: "",
  //     wrkPostalCode: "",
  //     workCategory: "",
  //     workAddress: "",
  //   },
  //   validationSchema: Yup.object().shape({
  //     workProvince: Yup.string().required(REQUIRED_TEXT),
  //     workCity: Yup.string().required(REQUIRED_TEXT),
  //     WorkStreet: Yup.string().required(REQUIRED_TEXT),
  //     workPostalCode: Yup.string().required(REQUIRED_TEXT),
  //     workCategory: Yup.string().required(REQUIRED_TEXT),
  //     workAddress: Yup.string().required(REQUIRED_TEXT),
  //   }),
  //   onSubmit: () => {},
  // });

  // const organizatonFormik = useFormik({
  //   initialValues: {
  //     organizationName: "",
  //     organizationCategory: "",
  //     organizationAddress: "",
  //   },
  //   validationSchema: Yup.object().shape({
  //     organizationName: Yup.string().required(REQUIRED_TEXT),
  //     organizationCategory: Yup.string().required(REQUIRED_TEXT),
  //     WorkStreet: Yup.string().required(REQUIRED_TEXT),
  //   }),
  //   onSubmit: () => {},
  // });

  const { mutate: personalSubmitHandler } = useMutation({
    mutationFn: (data: any) => {
      return createClient(data);
    },
    onSuccess: () => {},
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
      if (!livingFormik.values.country) {
        const cities: OptionType[] = cityData?.data.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setCityOptions(cities);
      } else {
        const cities: OptionType[] = cityData?.data
          ?.filter((item) => item.countryId === livingFormik.values.country)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setCityOptions(cities);
      }
    }
  }, [cityData, livingFormik.values.country]);
  return (
    <main>
      <div>
        <Title label="ثبت قرارداد" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "قرارداد جدید",
            },
          ]}
        />
      </div>
      {contract && (
        <EditableContainer
          list={[
            {
              label: "تاریخ درج",
              value: contract?.submitDateTime ?? "",
              // value:convertTime(contract?.submitDateTime,"Gregorian","Solar")
            },
            {
              label: "تاریخ قرارداد",
              value: contract?.contractDate ?? "",
            },
            {
              label: "شماره قرار داد",
              value: contract?.contractNo ?? "",
            },
            {
              label: "موضوع قرار داد",
              value: contract?.contractType?.name ?? "",
            },
            {
              label: "توضیحات",
              value: contract?.description ?? "",
            },
          ]}
          action={{
            label: "ویرایش اطلاعات",
            icon: (
              <Image
                src={"/icons/edit.png"}
                alt="edit"
                width={24}
                height={24}
              />
            ),
            click: () => console.log("clicked"),
          }}
          contract={contract}
        />
      )}
      <RadioGroup
        defaultValue="personal"
        className="flex flex-row-reverse gap-4 min-h-10"
      >
        <div className="flex items-center space-x-2">
          <label htmlFor="personal">شخصی</label>
          <RadioGroupItem
            value="personal"
            id="personal"
            onClick={() => setCategory("personal")}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="organization">سازمانی</label>
          <RadioGroupItem
            value="organization"
            id="organization"
            onClick={() => setCategory("organization")}
          />
        </div>
      </RadioGroup>

      {category === "personal" ? (
        <FormTabContainer
          defaultValue="اطلاعات مشتری"
          tabs={[
            {
              title: "اطلاعات مشتری",
              forms: [
                {
                  title: "اطلاعات شخصی",
                  formInfo: {
                    form: personalFormik,
                    fields: createFormFields("personalFormik"),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    personalSubmitHandler({
                      firstName: personalFormik.values.name,
                      lastName: personalFormik.values.familyName,
                      birthdate: personalFormik.values.birthdate,
                      socialNumber: personalFormik.values.socialNumber,
                      idNumber: personalFormik.values.idNumber,
                      career: personalFormik.values.career,
                      isMainCustomer: true,
                    });
                  },
                },
              ],
              children: (
                <ServiceContainer
                  askQuestion={false}
                  services={services}
                  multiChosen={true}
                />
              ),
            },

            // {
            //   title: "اطلاعات محل سکونت",
            //   forms: [
            //     {
            //       title: "اطلاعات محل سکونت",
            //       formInfo: {
            //         form: livingFormik,
            //         fields: createFormFields(
            //           "livingFormik",
            //           cityOptions,
            //           countryOptions
            //         ),
            //         className: "flex flex-row-reverse",
            //       },
            //       formValues: {
            //         province: livingFormik.values.province,
            //         city: livingFormik.values.city,
            //         street: livingFormik.values.street,
            //         postalCode: livingFormik.values.postalCode,
            //         category: livingFormik.values.category,
            //         address: livingFormik.values.address,
            //       },
            //     },
            //     {
            //       title: "اطلاعات تماس",
            //       formInfo: {
            //         form: livingContactFormik,
            //         fields: createFormFields("livingContactFormik"),
            //         className: "flex flex-row-reverse",
            //       },
            //     },
            //   ],

            //   children: (
            //     <ServiceContainer
            //       askQuestion={false}
            //       services={services}
            //       multiChosen={true}
            //     />
            //   ),
            // },
            // {
            //   title: "اطلاعات محل کار",
            //   forms: [
            //     {
            //       title: "اطلاعات محل کار",
            //       formInfo: {
            //         form: workFormik,
            //         fields: createFormFields("workFormik"),
            //         className: "flex flex-row-reverse",
            //       },
            //     },
            //     {
            //       title: "اطلاعات تماس",
            //       formInfo: {
            //         form: workContactFormik,
            //         fields: createFormFields("workContactFormik"),
            //         className: "flex flex-row-reverse",
            //       },
            //     },
            //   ],
            //   children: (
            //     <ServiceContainer
            //       askQuestion={false}
            //       services={services}
            //       multiChosen={true}
            //     />
            //   ),
            // },
          ]}
        />
      ) : (
        <FormTabContainer
          defaultValue="اطلاعات سازمان"
          tabs={[
            {
              title: "اطلاعات سازمان",
              forms: [
                // {
                //   title: "اطلاعات سازمان",
                //   formInfo: {
                //     form: organizatonFormik,
                //     fields: createFormFields("organizatonFormik"),
                //     className: "flex flex-row-reverse",
                //   },
                // },
              ],
              children: (
                <ServiceContainer
                  askQuestion={false}
                  services={services}
                  multiChosen={true}
                >
                  <RegisteryForm />
                </ServiceContainer>
              ),
            },
          ]}
        />
      )}
    </main>
  );
}

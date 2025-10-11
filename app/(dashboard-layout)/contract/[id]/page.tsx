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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContractById } from "@/api/contract";
import { useParams } from "next/navigation";
import { services } from "@/constants/services";
import FormTabContainer from "@/components/shared/form-tab-container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { dateType, REQUIRED_TEXT } from "@/lib/utils";
import { createFormFields } from "@/constants/client-form-fields";
import {
  createClient,
  createOrganization,
  editAddressData,
  editClient,
  editCommunicationData,
  insertAddressData,
  insertCommunicationData,
  insertSubmitterData,
} from "@/api/client";
import { getCities, getCountries, getProvinces } from "@/api/location";
import { OptionType } from "@/components/shared/form-maker";
import {
  clientAddress,
  Communicater,
  CommunicationType,
} from "@/types/globals";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { sendServiceData } from "@/api/service";
import { convertDate, convertToGregorian } from "@/lib/date";

import { getUsers } from "@/api/auth";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { AccessDenied } from "@/components/shared/AccessDenied";

export default function Contract() {
  const router = useRouter();
  const pageFeatures = usePageData();


  const [contractServices, setContractServices] = useState<OptionType[]>([]);
  const [category, setCategory] = useState("personal");
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<OptionType[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const [workCountryOptions, setWorkCountryOptions] = useState<OptionType[]>(
    []
  );
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [workProvinceOptions, setWorkProvinceOptions] = useState<OptionType[]>(
    []
  );
  const [workCityOptions, setWorkCityOptions] = useState<OptionType[]>([]);
  const [agencyCountryOptions, setAgencyCountryOptions] = useState<
    OptionType[]
  >([]);
  const [agencyProvinceOptions, setAgencyProvinceOptions] = useState<
    OptionType[]
  >([]);
  const [agencyCityOptions, setAgencyCityOptions] = useState<OptionType[]>([]);
  const [personalInfo, setPersonalInfo] = useState<any>();
  const [addressInfo, setAddressInfo] = useState<any>();
  const [workAddress, setWorkAddress] = useState<any>();
  const [livingContact, setLivingContact] = useState<any>();
  const [workContact, setWorkContact] = useState<any>();
  const [organizationContact, setOrganizationContact] = useState<any>();

  const { id } = useParams();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const organizationId = searchParams.get("organizationId");

  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(Number(id) as number),
  });
  useEffect(() => {
    if (contract) {
      if (
        contract?.data?.mainCustomerSoldto &&
        contract?.data?.mainCustomerSoldto !== null
      ) {
        const personData = contract?.data?.mainCustomerSoldto?.person;
        const mainCustomerId = contract?.data?.mainCustomerSoldto?.id;

        setPersonalInfo({
          name: personData?.firstName,
          familyName: personData?.lastName,
          birthdate:
            personData?.birthdate &&
            convertDate(personData?.birthdate, dateType),
          socialNumber: personData?.idCertificate,
          idNumber: personData?.idNumber,
          career: personData?.personJobs[0]?.jobs?.name,
          personId: personData?.id,
          isSubmitted: true,
        });

        router.push(`?customerId=${mainCustomerId}`);
      } else {
        setPersonalInfo({
          name: "",
          familyName: "",
          birthdate: "",
          socialNumber: "",
          idNumber: "",
          career: "",
          personId: "",
          isSubmitted: false,
        });
      }
      if (contract?.data?.mainCustomerSoldto?.address?.length > 0) {
        const addressData = contract?.data?.mainCustomerSoldto?.address;
        setAddressInfo({
          addressId: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.id,
          address: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.address,
          postalCode: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.postalCode,
          street: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.street,
          cityId: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.cityId,
          countryId: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.countryId,
          provinceId: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.livingAddress
          )?.provinceId,
          isSubmitted: true,
        });

        setWorkAddress({
          addressId: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.id,
          workProvince: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.provinceId,
          workCity: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.cityId,
          workStreet: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.street,
          workPostalCode: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.postalCode,
          workCategory: "",
          workAddress: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.address,
          workCountry: addressData?.find(
            (item: any) => item?.addressTypeId === clientAddress.workAddress
          )?.countryId,
          isSubmitted: true,
        });
      } else {
        setAddressInfo({
          addressId: "",
          address: "",
          postalCode: "",
          street: "",
          cityId: "",
          countryId: "",
          provinceId: "",
          isSubmitted: false,
        });
        setWorkAddress({
          addressId: "",
          workProvince: "",
          workCity: "",
          workStreet: "",
          workPostalCode: "",
          workCategory: "",
          workAddress: "",
          workCountry: "",
          isSubmitted: false,
        });
      }
      if (contract?.data?.mainCustomerSoldto?.Communication !== null) {
        const contactData = contract?.data?.mainCustomerSoldto?.Communication;
        setLivingContact({
          personalPhone: contactData?.mobile?.find(
            (item: any) => item?.communicater === "HOME"
          )?.communicationDetails,
          personalPhoneId: contactData?.mobile?.find(
            (item: any) => item?.communicater === "HOME"
          )?.id,
          homePhone: contactData?.homePhone?.find(
            (item: any) => item?.communicater === "HOME"
          )?.communicationDetails,
          homePhoneId: contactData?.homePhone?.find(
            (item: any) => item?.communicater === "HOME"
          )?.id,
          email: contactData?.email?.find(
            (item: any) => item?.communicater === "HOME"
          )?.communicationDetails,
          emailId: contactData?.email?.find(
            (item: any) => item?.communicater === "HOME"
          )?.id,
          website: contactData?.website?.find(
            (item: any) => item?.communicater === "HOME"
          )?.communicationDetails,
          websiteId: contactData?.website?.find(
            (item: any) => item?.communicater === "HOME"
          )?.id,
          isSubmitted: true,
        });
        setWorkContact({
          jobPhone: contactData?.businessPhone?.find(
            (item: any) => item?.communicater === "BUSINESS"
          )?.communicationDetails,
          jobphoneId: contactData?.businessPhone?.find(
            (item: any) => item?.communicater === "BUSINESS"
          )?.id,
          email: contactData?.email?.find(
            (item: any) => item?.communicater === "BUSINESS"
          )?.communicationDetails,
          emailId: contactData?.email?.find(
            (item: any) => item?.communicater === "BUSINESS"
          )?.id,
          website: contactData?.website?.find(
            (item: any) => item?.communicater === "BUSINESS"
          )?.communicationDetails,
          websiteId: contactData?.website?.find(
            (item: any) => item?.communicater === "BUSINESS"
          )?.id,
          isSubmitted: true,
        });
        setOrganizationContact({
          organizationPhone: "",
          organizationEmail: contactData?.email?.find(
            (item: any) => item?.communicater === "ORGANIZATION"
          )?.communicationDetails,
          organizationWebsite: contactData?.website?.find(
            (item: any) => item?.communicater === "ORGANIZATION"
          )?.communicationDetails,
          isSubmitted: true,
        });
      } else {
        setLivingContact({
          personalPhone: "",
          personalPhoneId: "",
          homePhone: "",
          homePhoneId: "",
          email: "",
          emailId: "",
          website: "",
          websiteId: "",
          isSubmitted: false,
        });
        setWorkContact({
          jobPhone: "",
          email: "",
          website: "",
          isSubmitted: false,
        });
        setOrganizationContact({
          organizationPhone: "",
          organizationEmail: "",
          organizationWebsite: "",
          isSubmitted: false,
        });
      }
    }
  }, [contract]);

  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });
  useEffect(() => {
    if (users && users?.data?.length > 0) {
      const userOption: OptionType[] = users?.data?.map((item: any) => ({
        label: item.fullName,
        value: item.id.toString(),
      }));
      setUserOptions(userOption);
    }
  }, [users]);
  const personalFormik = useFormik({
    initialValues: {
      name: personalInfo?.name,
      familyName: personalInfo?.familyName,
      birthdate: personalInfo?.birthdate,
      socialNumber: personalInfo?.socialNumber,
      idNumber: personalInfo?.idNumber,
      career: personalInfo?.career,
      birthdateType: "",
      isSubmitted: personalInfo?.isSubmitted,
      personId: personalInfo?.personId,
    },

    validationSchema: Yup.object().shape({
      // name: Yup.string().required(REQUIRED_TEXT),
      // familyName: Yup.string().required(REQUIRED_TEXT),
      // birthdate: Yup.string().required(REQUIRED_TEXT),
      // socialNumber: Yup.string().required(REQUIRED_TEXT),
      idNumber: Yup.string()
        .required(REQUIRED_TEXT)
        .matches(/^\d{10}$/, "کدملی باید یک  عدد ده رقمی باشد"),
      // career: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => { },
    enableReinitialize: true,
  });

  const livingContactFormik = useFormik({
    initialValues: {
      personalPhone: livingContact?.personalPhone,
      personalPhoneId: livingContact?.personalPhoneId,
      homePhone: livingContact?.homePhone,
      homePhoneId: livingContact?.homePhoneId,
      email: livingContact?.email,
      emailId: livingContact?.emailId,
      website: livingContact?.website,
      websiteId: livingContact?.websiteId,
      isSubmitted: livingContact?.isSubmitted,
    },

    validationSchema: Yup.object().shape({
      personalPhone: Yup.string().required(REQUIRED_TEXT),
      homePhone: Yup.string().required(REQUIRED_TEXT),
      email: Yup.string().required(REQUIRED_TEXT),
      website: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => { },
    enableReinitialize: true,
  });

  const workContactFormik = useFormik({
    initialValues: {
      jobPhone: workContact?.jobPhone,
      jobPhoneId: workContact?.jobPhoneId,
      email: workContact?.email,
      emailId: workContact?.emailId,
      website: workContact?.website,
      websiteId: workContact?.websiteId,
      isSubmitted: workContact?.isSubmitted,
    },
    validationSchema: Yup.object().shape({
      jobPhone: Yup.string().required(REQUIRED_TEXT),
      email: Yup.string().required(REQUIRED_TEXT),
      website: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => { },
    enableReinitialize: true,
  });
  const organizationContactFormik = useFormik({
    initialValues: {
      organizationPhone: "",
      organizationEmail: "",
      organizationWebsite: "",
    },
    validationSchema: Yup.object().shape({
      organizationPhone: Yup.string().required(REQUIRED_TEXT),
      organizationEmail: Yup.string().required(REQUIRED_TEXT),
      organizationWebsite: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => { },
  });

  const livingFormik = useFormik({
    initialValues: {
      addressId: addressInfo?.addressId,
      province: addressInfo?.provinceId,
      city: addressInfo?.cityId,
      street: addressInfo?.street,
      postalCode: addressInfo?.postalCode,
      category: "",
      address: addressInfo?.address,
      country: addressInfo?.countryId?.toString(),
      isSubmitted: addressInfo?.isSubmitted,
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
    enableReinitialize: true,
    onSubmit: () => { },
  });

  const workFormik = useFormik({
    initialValues: {
      addressId: workAddress?.addressId,
      workProvince: workAddress?.workProvince,
      workCity: workAddress?.workCity,
      workStreet: workAddress?.workStreet,
      workPostalCode: workAddress?.workPostalCode,
      workCategory: "",
      workAddress: workAddress?.workAddress,
      workCountry: workAddress?.workCountry,
      isSubmitted: workAddress?.isSubmitted,
    },
    validationSchema: Yup.object().shape({
      workProvince: Yup.string().required(REQUIRED_TEXT),
      workCity: Yup.string().required(REQUIRED_TEXT),
      workStreet: Yup.string().required(REQUIRED_TEXT),
      workPostalCode: Yup.string().required(REQUIRED_TEXT),
      workCategory: Yup.string().required(REQUIRED_TEXT),
      workAddress: Yup.string().required(REQUIRED_TEXT),
      workCountry: Yup.string().required(REQUIRED_TEXT),
    }),
    enableReinitialize: true,
    onSubmit: () => { },
  });

  const organizationFormik = useFormik({
    initialValues: {
      organizationName: "",
      // organizationCategory: "",
      // organizationAddress: "",
    },
    validationSchema: Yup.object().shape({
      organizationName: Yup.string().required(REQUIRED_TEXT),
      // organizationCategory: Yup.string().required(REQUIRED_TEXT),
      // organizationAddress: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => { },
  });
  const organizationAddressFormik = useFormik({
    initialValues: {
      organizationCountry: undefined,
      organizationProvince: undefined,
      organizationCity: undefined,
      organizationStreet: "",
      organizationPostalCode: "",
      organizationAddress: "",
    },
    validationSchema: Yup.object().shape({
      organizationCountry: Yup.string().required(REQUIRED_TEXT),
      organizationProvince: Yup.string().required(REQUIRED_TEXT),
      organizationCity: Yup.string().required(REQUIRED_TEXT),
      organizationStreet: Yup.string().required(REQUIRED_TEXT),
      organizationPostalCode: Yup.string().required(REQUIRED_TEXT),
      organizationAddress: Yup.string().required(REQUIRED_TEXT),
    }),
    enableReinitialize: true,
    onSubmit: () => { },
  });
  const { mutate: SubmitterHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertSubmitterData(data, Number(id));
    },
    onSuccess: () => {
      router.push(`/contract/service/${id}`);
    },
  });

  const { mutate: personalSubmitHandler } = useMutation({
    mutationFn: (data: any) => {
      return createClient(data, Number(id));
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["contract"],
      });
      if (result.status === "success") {
        const customerId = result?.data?.customerId;
        const url = organizationId
          ? `?customerId=${customerId}&organizationId=${organizationId}`
          : `?customerId=${customerId}`;
        router.push(url);
      }
    },
  });
  const { mutate: personalEditHandler } = useMutation({
    mutationFn: ({ data, personId }: { data: any; personId: number }) => {
      return editClient(data, personId);
    },
    onSuccess: () => { },
  });
  const { mutate: organizationSubmitHandler } = useMutation({
    mutationFn: (data: any) => {
      return createOrganization(data);
    },
    onSuccess: (result) => {
      if (result.status === "success") {
        const organizationId = result.data.id;
        const url = customerId
          ? `?customerId=${customerId}&organizationId=${organizationId}`
          : `?organizationId=${organizationId}`;
        router.push(url);
      }
    },
  });
  const { mutate: addressInfoHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertAddressData(data);
    },
    onSuccess: () => { },
  });
  const { mutate: addressEditHandler } = useMutation({
    mutationFn: ({ data, addressId }: { data: any; addressId: number }) => {
      return editAddressData(data, addressId);
    },
    onSuccess: () => { },
  });
  function submitAddressInfo() {
    const data = {
      address: livingFormik.values.address,
      postalCode: livingFormik.values.postalCode,
      street: livingFormik.values.street,
      provinceId: livingFormik.values.province,
      cityId: livingFormik.values.city,
      countryId: livingFormik.values.country,
      customerId: customerId,
      addressTypeId: clientAddress.livingAddress,
    };
    if (!livingFormik.values.isSubmitted) {
      addressInfoHandler(data);
    } else {
      addressEditHandler({
        data: data,
        addressId: livingFormik.values.addressId,
      });
    }
  }
  function submitWorkAddress() {
    const data = {
      address: workFormik.values.workAddress,
      postalCode: workFormik.values.workPostalCode,
      //apartmentNo: "string",
      // longitude: 1,
      //latitude: 1,
      //googleUrl: "string",
      street: workFormik.values.workStreet,
      //"district": "string",
      cityId: workFormik.values.workCity,
      countryId: workFormik.values.workCountry,
      customerId: customerId,
      addressTypeId: clientAddress.workAddress,
    };
    if (!workFormik.values.isSubmitted) {
      addressInfoHandler(data);
    } else {
      addressEditHandler({
        data: data,
        addressId: workFormik.values.addressId,
      });
    }
  }
  const { mutate: communicateHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertCommunicationData(data);
    },
    onSuccess: () => { },
  });
  const { mutate: editCommunicateHandler } = useMutation({
    mutationFn: (data: any) => {
      return editCommunicationData(data);
    },
    onSuccess: () => { },
  });
  const { mutate: submitService } = useMutation({
    mutationFn: (data: any) => {
      return sendServiceData(data, Number(id));
    },
    onSuccess: () => { },
  });

  const { data: countryData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => await getCountries(),
  });
  const { data: provinceData } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => await getProvinces(),
  });

  const { data: cityData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => await getCities(),
  });
  useEffect(() => {
    if (countryData && countryData?.data?.length > 0) {
      const countryOptions: OptionType[] = countryData?.data?.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setCountryOptions(countryOptions);
      setWorkCountryOptions(countryOptions);
      setAgencyCountryOptions(countryOptions);
    }
  }, [countryData]);
  useEffect(() => {
    if (provinceData && provinceData?.data?.length > 0) {
      if (!livingFormik.values.country) {
        const provinces: OptionType[] = provinceData?.data?.map(
          (item: any) => ({
            label: item.name,
            value: item.id.toString(),
          })
        );

        setProvinceOptions(provinces);
      } else {
        const provinces: OptionType[] = provinceData?.data
          ?.filter(
            (item: any) => item.countryId === livingFormik.values.country
          )
          .map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setProvinceOptions(provinces);
      }
    }
  }, [provinceData, livingFormik.values.country]);
  useEffect(() => {
    if (provinceData && provinceData?.data?.length > 0) {
      if (!workFormik.values.workCountry) {
        const provinces: OptionType[] = provinceData?.data?.map(
          (item: any) => ({
            label: item.name,
            value: item.id.toString(),
          })
        );

        setWorkProvinceOptions(provinces);
      } else {
        const provinces: OptionType[] = provinceData?.data
          ?.filter(
            (item: any) => item.countryId === workFormik.values.workCountry
          )
          .map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setWorkProvinceOptions(provinces);
      }
    }
  }, [provinceData, workFormik.values.workCountry]);
  useEffect(() => {
    if (provinceData && provinceData?.data?.length > 0) {
      if (!organizationAddressFormik.values.organizationCountry) {
        const provinces: OptionType[] = provinceData?.data?.map(
          (item: any) => ({
            label: item.name,
            value: item.id.toString(),
          })
        );

        setAgencyProvinceOptions(provinces);
      } else {
        const provinces: OptionType[] = provinceData?.data
          ?.filter(
            (item: any) =>
              item.countryId ===
              organizationAddressFormik.values.organizationCountry
          )
          .map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setAgencyProvinceOptions(provinces);
      }
    }
  }, [provinceData, organizationAddressFormik.values.organizationCountry]);

  useEffect(() => {
    if (cityData && cityData?.data?.length > 0) {
      if (!livingFormik.values.province) {
        const cities: OptionType[] = cityData?.data?.map((item) => ({
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
  useEffect(() => {
    if (cityData && cityData?.data?.length > 0) {
      if (!workFormik.values.workCountry) {
        const cities: OptionType[] = cityData?.data?.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setWorkCityOptions(cities);
      } else {
        const cities: OptionType[] = cityData?.data
          ?.filter((item) => item.countryId === workFormik.values.workCountry)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setWorkCityOptions(cities);
      }
    }
  }, [cityData, workFormik.values.workCountry]);
  useEffect(() => {
    if (cityData && cityData?.data?.length > 0) {
      if (!organizationAddressFormik.values.organizationProvince) {
        const cities: OptionType[] = cityData?.data?.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setAgencyCityOptions(cities);
      } else {
        const cities: OptionType[] = cityData?.data
          ?.filter(
            (item) =>
              item.provinceId ===
              organizationAddressFormik.values.organizationProvince
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setAgencyCityOptions(cities);
      }
    }
  }, [cityData, organizationAddressFormik.values.organizationProvince]);

  function serviceHandler(services: any) {
    setContractServices(services.map((obj: any) => obj.name));
  }
  async function submitPersonalForm() {
    const errors = await personalFormik.validateForm();
    personalFormik.setTouched({ idNumber: true }); // Optional: shows error in UI

    if (Object.keys(errors).length > 0) return;
    const data = {
      firstName: personalFormik.values.name,
      lastName: personalFormik.values.familyName,
      birthdate:
        personalFormik.values.birthdate && personalFormik.values.birthdateType
          ? convertToGregorian(
            personalFormik.values.birthdate,
            personalFormik.values.birthdateType
          )
          : "",

      idCertificate: personalFormik.values.socialNumber,
      idNumber: personalFormik.values.idNumber,
      job: personalFormik.values.career,
      isMainCustomer: true,
      contractId: Number(id),
    };
    if (!personalFormik.values.isSubmitted) {
      personalSubmitHandler(data);
    } else {
      personalEditHandler({
        data: data,
        personId: personalFormik.values.personId,
      });
    }
  }

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

              value:
                contract?.data?.submitDateTime && contract?.data?.dateType
                  ? convertDate(
                    contract?.data?.submitDateTime,
                    contract?.data?.dateType
                  )
                  : "",
            },
            {
              label: "تاریخ قرارداد",

              value:
                contract?.data?.contractDate && contract?.data?.dateType
                  ? convertDate(
                    contract?.data?.contractDate,
                    contract?.data?.dateType
                  )
                  : "",
            },
            {
              label: "شماره قرار داد",
              value: contract?.data?.contractNo ?? "",
            },
            {
              label: "موضوع قرار داد",
              value: contract?.data?.contractType?.name ?? "",
            },
            {
              label: "توضیحات",
              value: contract?.data?.description ?? "",
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

      <div className={category === "organization" ? "hidden" : ""}>
        <FormTabContainer
          hasAccess={pageFeatures && generateFeatureAccess(pageFeatures
            , "customer-creation")?.show && generateFeatureAccess(pageFeatures
              , "customer-creation")?.enable ? true : false}
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
                    submitPersonalForm();
                  },
                },
              ],
              children: (
                <ServiceContainer
                  roleAcess={pageFeatures && generateFeatureAccess(pageFeatures
                    , "add-service")?.show && generateFeatureAccess(pageFeatures
                      , "add-service")?.enable ? true : false}
                  askQuestion={false}
                  services={services}
                  multiChosen={true}
                  onActiveItemChange={serviceHandler}
                >
                  {" "}
                  {

                    generateFeatureAccess(pageFeatures
                      , "add-service")?.show && generateFeatureAccess(pageFeatures
                        , "add-service")?.enable && (<Button
                          variant={"info"}
                          className="w-24 mx-2"
                          onClick={() => {
                            submitService({ avServices: contractServices });
                          }}
                        >
                          ثبت
                        </Button>)
                  }
                  {generateFeatureAccess(pageFeatures
                    , "add-service")?.show && !generateFeatureAccess(pageFeatures
                      , "add-service")?.enable && (<AccessDenied
                        featureCode="add-service"
                        variant={""}
                        title=" ثبت "
                        message="شما به این بخش دسترسی ندارید"

                      />

                    )}

                  <RegisteryForm
                    roleAcess={pageFeatures && generateFeatureAccess(pageFeatures
                      , "add-service")?.show && generateFeatureAccess(pageFeatures
                        , "add-service")?.enable ? true : false}
                    submitForm={SubmitterHandler}
                    accountant={
                      contract?.userResponsible?.id
                        ? contract?.userResponsible?.id.toString()
                        : ""
                    }
                    accountantOptions={userOptions}
                  />
                </ServiceContainer>
              ),
            },

            {
              title: "اطلاعات محل سکونت",
              forms: [
                {
                  title: "اطلاعات محل سکونت",
                  formInfo: {
                    form: livingFormik,
                    fields: createFormFields(
                      "livingFormik",
                      countryOptions,
                      provinceOptions,
                      cityOptions
                    ),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    submitAddressInfo();
                  },
                },
                {
                  title: "اطلاعات تماس",
                  formInfo: {
                    form: livingContactFormik,
                    fields: createFormFields("livingContactFormik"),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    if (!livingContactFormik.values.isSubmitted) {
                      communicateHandler([
                        {
                          communicationDetails:
                            livingContactFormik.values.personalPhone,
                          communicationType: CommunicationType.mobile,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                        {
                          communicationDetails:
                            livingContactFormik.values.homePhone,
                          communicationType: CommunicationType.home,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                        {
                          communicationDetails:
                            livingContactFormik.values.email,
                          communicationType: CommunicationType.email,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                        {
                          communicationDetails:
                            livingContactFormik.values.website,
                          communicationType: CommunicationType.website,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                      ]);
                    } else {
                      editCommunicateHandler([
                        {
                          id: livingContactFormik.values.personalPhoneId,
                          communicationDetails:
                            livingContactFormik.values.personalPhone,
                          communicationType: CommunicationType.mobile,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                        {
                          id: livingContactFormik.values.homePhoneId,
                          communicationDetails:
                            livingContactFormik.values.homePhone,
                          communicationType: CommunicationType.home,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                        {
                          id: livingContactFormik.values.emailId,
                          communicationDetails:
                            livingContactFormik.values.email,
                          communicationType: CommunicationType.email,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                        {
                          id: livingContactFormik.values.websiteId,
                          communicationDetails:
                            livingContactFormik.values.website,
                          communicationType: CommunicationType.website,
                          communicater: Communicater.home,
                          customerId: Number(customerId),
                        },
                      ]);
                    }
                  },
                },
              ],

              children: (
                <ServiceContainer
                  roleAcess={generateFeatureAccess(pageFeatures
                    , "add-service")?.show && generateFeatureAccess(pageFeatures
                      , "add-service")?.enable ? true : false}
                  askQuestion={false}
                  services={services}
                  multiChosen={true}
                  onActiveItemChange={serviceHandler}
                >
                  {" "}

                  {

                    generateFeatureAccess(pageFeatures
                      , "add-service")?.show && generateFeatureAccess(pageFeatures
                        , "add-service")?.enable && (<Button
                          variant={"info"}
                          className="w-24 mx-2"
                          onClick={() => {
                            submitService({ avServices: contractServices });
                          }}
                        >
                          ثبت
                        </Button>)
                  }
                  {generateFeatureAccess(pageFeatures
                    , "add-service")?.show && !generateFeatureAccess(pageFeatures
                      , "add-service")?.enable && (<AccessDenied
                        featureCode="add-service"
                        variant={""}
                        title=" ثبت "
                        message="شما به این بخش دسترسی ندارید"

                      />

                    )}


                  <RegisteryForm
                    submitForm={SubmitterHandler}
                    accountant={
                      contract?.userResponsible?.id
                        ? contract?.userResponsible?.id.toString()
                        : ""
                    }
                    accountantOptions={userOptions}
                  />
                </ServiceContainer>
              ),
            },
            {
              title: "اطلاعات محل کار",
              forms: [
                {
                  title: "اطلاعات محل کار",
                  formInfo: {
                    form: workFormik,
                    fields: createFormFields(
                      "workFormik",
                      workCountryOptions,
                      workProvinceOptions,
                      workCityOptions
                    ),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    submitWorkAddress();
                  },
                },
                {
                  title: "اطلاعات تماس",
                  formInfo: {
                    form: workContactFormik,
                    fields: createFormFields("workContactFormik"),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    if (!workContactFormik.values.isSubmitted) {
                      communicateHandler([
                        {
                          communicationDetails:
                            workContactFormik.values.jobPhone,
                          communicationType: CommunicationType.business,
                          communicater: Communicater.business,
                          customerId: Number(customerId),
                          //  organizationId: null,
                          // contractId: Number(id),
                        },
                        {
                          communicationDetails: workContactFormik.values.email,
                          communicationType: CommunicationType.email,
                          communicater: Communicater.business,
                          customerId: Number(customerId),
                          // organizationId: null,
                          // contractId: Number(id),
                        },
                        {
                          communicationDetails:
                            workContactFormik.values.website,
                          communicationType: CommunicationType.website,
                          communicater: Communicater.business,
                          customerId: Number(customerId),
                          // organizationId: null,
                          // contractId: Number(id),
                        },
                      ]);
                    } else {
                      editCommunicateHandler([
                        {
                          id: workContactFormik.values.jobPhoneId,
                          communicationDetails:
                            workContactFormik.values.jobPhone,
                          communicationType: CommunicationType.business,
                          communicater: Communicater.business,
                          customerId: Number(customerId),
                          //  organizationId: null,
                          // contractId: Number(id),
                        },
                        {
                          id: workContactFormik.values.emailId,
                          communicationDetails: workContactFormik.values.email,
                          communicationType: CommunicationType.email,
                          communicater: Communicater.business,
                          customerId: Number(customerId),
                          // organizationId: null,
                          // contractId: Number(id),
                        },
                        {
                          id: workContactFormik.values.websiteId,
                          communicationDetails:
                            workContactFormik.values.website,
                          communicationType: CommunicationType.website,
                          communicater: Communicater.business,
                          customerId: Number(customerId),
                          // organizationId: null,
                          // contractId: Number(id),
                        },
                      ]);
                    }
                  },
                },
              ],
              children: (
                <ServiceContainer
                  roleAcess={generateFeatureAccess(pageFeatures
                    , "add-service")?.show && generateFeatureAccess(pageFeatures
                      , "add-service")?.enable ? true : false}
                  askQuestion={false}
                  services={services}
                  multiChosen={true}
                  onActiveItemChange={serviceHandler}
                >
                  {" "}
                  {/* <Button
                    variant={"info"}
                    className="w-24 mx-2"
                    onClick={() => {
                      submitService({ avServices: contractServices });
                    }}
                  >
                    ثبت
                  </Button> */}
                  {

                    generateFeatureAccess(pageFeatures
                      , "add-service")?.show && generateFeatureAccess(pageFeatures
                        , "add-service")?.enable && (<Button
                          variant={"info"}
                          className="w-24 mx-2"
                          onClick={() => {
                            submitService({ avServices: contractServices });
                          }}
                        >
                          ثبت
                        </Button>)
                  }
                  {generateFeatureAccess(pageFeatures
                    , "add-service")?.show && !generateFeatureAccess(pageFeatures
                      , "add-service")?.enable && (<AccessDenied
                        featureCode="add-service"
                        variant={""}
                        title=" ثبت "
                        message="شما به این بخش دسترسی ندارید"

                      />

                    )}

                  <RegisteryForm
                    submitForm={SubmitterHandler}
                    accountant={
                      contract?.userResponsible?.id
                        ? contract?.userResponsible?.id.toString()
                        : ""
                    }
                    accountantOptions={userOptions}
                  />
                </ServiceContainer>
              ),
            },
          ]}
        />
      </div>

      <div className={category === "personal" ? "hidden" : ""}>
        <FormTabContainer
          hasAccess={generateFeatureAccess(pageFeatures
            , "customer-creation")?.show && generateFeatureAccess(pageFeatures
              , "customer-creation")?.enable ? true : false}

          defaultValue="اطلاعات سازمان"
          tabs={[
            {
              title: "اطلاعات سازمان",
              forms: [
                {
                  title: "اطلاعات سازمان",
                  formInfo: {
                    form: organizationFormik,
                    fields: createFormFields("organizationFormik"),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    organizationSubmitHandler({
                      businessName: organizationFormik.values.organizationName,
                      // dba: "string",
                      // licenceNo: "string",
                      // organizationStatusId: 1,
                      // uniqueId: "string",
                      // complexId: 1,
                      // containerName: "string",
                      // personOwnerId: 1,
                    });
                  },
                },
              ],
              children: (
                <ServiceContainer

                  roleAcess={generateFeatureAccess(pageFeatures
                    , "add-service")?.show && generateFeatureAccess(pageFeatures
                      , "add-service")?.enable ? true : false} askQuestion={false}
                  services={services}
                  multiChosen={true}
                  onActiveItemChange={serviceHandler}
                >
                  {" "}
                  <Button
                    variant={"info"}
                    className="w-24 mx-2"
                    onClick={() => {
                      submitService({ avServices: contractServices });
                    }}
                  >
                    ثبت
                  </Button>
                  <RegisteryForm
                    submitForm={SubmitterHandler}
                    accountant={
                      contract?.userResponsible?.id
                        ? contract?.userResponsible?.id.toString()
                        : ""
                    }
                    accountantOptions={userOptions}
                  />
                </ServiceContainer>
              ),
            },
            {
              title: "آدرس سازمان",
              forms: [
                {
                  title: "آدرس سازمان",
                  formInfo: {
                    form: organizationAddressFormik,
                    fields: createFormFields(
                      "organizationAddressFormik",
                      agencyCountryOptions,
                      agencyProvinceOptions,
                      agencyCityOptions
                    ),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    addressInfoHandler({
                      address:
                        organizationAddressFormik.values.organizationAddress,
                      postalCode:
                        organizationAddressFormik.values.organizationPostalCode,
                      //apartmentNo: "string",
                      //longitude: 1,
                      // latitude: 1,
                      //googleUrl: "string",
                      street:
                        organizationAddressFormik.values.organizationStreet,
                      // district: "string",
                      cityId: organizationAddressFormik.values.organizationCity,
                      countryId:
                        organizationAddressFormik.values.organizationCountry,
                      // customerId: 1,
                      organizationId: organizationId,
                      addressTypeId: clientAddress.workAddress,
                    });
                  },
                },
                {
                  title: "اطلاعات تماس",
                  formInfo: {
                    form: organizationContactFormik,
                    fields: createFormFields("organizationContactFormik"),
                    className: "flex flex-row-reverse",
                  },
                  submitForm: () => {
                    communicateHandler([
                      {
                        communicationDetails:
                          organizationContactFormik.values.organizationPhone,
                        communicationType: CommunicationType.business,
                        communicater: Communicater.organization,
                        //customerId: Number(customerId),
                        organizationId: organizationId,
                        // contractId: Number(id),
                      },
                      {
                        communicationDetails:
                          organizationContactFormik.values.organizationEmail,
                        communicationType: CommunicationType.email,
                        communicater: Communicater.organization,
                        //customerId: Number(customerId),
                        organizationId: organizationId,
                        // contractId: Number(id),
                      },
                      {
                        communicationDetails:
                          organizationContactFormik.values.organizationWebsite,
                        communicationType: CommunicationType.website,
                        communicater: Communicater.organization,
                        customerId: Number(customerId),
                        organizationId: organizationId,
                        // contractId: Number(id),
                      },
                    ]);
                  },
                },
              ],
              children: (
                <ServiceContainer
                  roleAcess={generateFeatureAccess(pageFeatures
                    , "add-service")?.show && generateFeatureAccess(pageFeatures
                      , "add-service")?.enable ? true : false}
                  askQuestion={false}
                  services={services}
                  multiChosen={true}
                  onActiveItemChange={serviceHandler}
                >
                  {" "}
                  {/* <Button
                    variant={"info"}
                    className="w-24 mx-2"
                    onClick={() => {
                      submitService({ avServices: contractServices });
                    }}
                  >
                    ثبت
                  </Button> */}
                  {

                    generateFeatureAccess(pageFeatures
                      , "add-service")?.show && generateFeatureAccess(pageFeatures
                        , "add-service")?.enable && (<Button
                          variant={"info"}
                          className="w-24 mx-2"
                          onClick={() => {
                            submitService({ avServices: contractServices });
                          }}
                        >
                          ثبت
                        </Button>)
                  }
                  {generateFeatureAccess(pageFeatures
                    , "add-service")?.show && !generateFeatureAccess(pageFeatures
                      , "add-service")?.enable && (<AccessDenied
                        featureCode="add-service"
                        variant={""}
                        title=" ثبت "
                        message="شما به این بخش دسترسی ندارید"

                      />

                    )}

                  <RegisteryForm
                    submitForm={SubmitterHandler}
                    accountant={
                      contract?.userResponsible?.id
                        ? contract?.userResponsible?.id.toString()
                        : ""
                    }
                    accountantOptions={userOptions}
                  />
                </ServiceContainer>
              ),
            },
          ]}
        />
      </div>
      {/* )} */}
    </main>
  );
}

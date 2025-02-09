import { REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";
import FormExtender, { FormExtenderInterface } from "../shared/form-extender";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getServiceTypes, sendHotelData } from "@/api/hotel";
import { getHotels } from "@/api/hotel";
import { OptionType } from "../shared/form-maker";
import { useParams } from "next/navigation";
import RegisteryForm from "../contract/registery-form";
import { insertSubmitterData } from "@/api/client";
import { getUsers } from "@/api/auth";
import { getContractById } from "@/api/contract";

export default function HotelForm() {
  const [serviceTypes, setServiceTypes] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);
  const [hotels, setHotels] = useState<OptionType[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const { id } = useParams();
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });
  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(Number(id) as number),
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
  const { mutate: SubmitterHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertSubmitterData(data, Number(id));
    },
    onSuccess: () => {},
  });
  const { data: serviceTypesData } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => await getServiceTypes(),
  });

  useEffect(() => {
    if (serviceTypesData) {
      const serviceOptions = serviceTypesData.data.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setServiceTypes(serviceOptions);
    }
  }, [serviceTypesData]);
  const { data: hotelsData, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => await getHotels(),
  });
  useEffect(() => {
    if (hotelsData) {
      const countryOptions: OptionType[] = hotelsData.data.map((item: any) => ({
        value: item.country.id.toString(),
        label: item.country.name,
        cities: item.country.city.map((item: any) => ({
          label: item.name,
          value: item.id,
          hotels: item.hotel.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        })),
      }));
      const cityOptions = hotelsData.data.flatMap((item: any) =>
        item.country.city.map((city: any) => ({
          value: city.id.toString(),
          label: city.name,
          hotels: city.hotel.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        }))
      );
      const hotelOptions = hotelsData.data.flatMap((item: any) =>
        item.country.city.flatMap((city: any) =>
          city.hotel.map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          }))
        )
      );

      setCountries(countryOptions);
      setCities(cityOptions);
      setHotels(hotelOptions);
    }
  }, [hotelsData]);

  const roomForm: any = {
    title: "مدت اقامت (رزرو اتاق)",
    name: "room",
    fields: [
      {
        key: "roomType",
        component: "Select",
        placeholder: "نوع اتاق",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "contractDateIn",
        component: "date",
        placeholder: "چک کردن",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "contractDateOut",
        component: "date",
        placeholder: "چک کردن",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "purchaseTitle",
        component: "non-field",
        children: <h2 className="w-full">خرید</h2>,
        className: "w-full text-right",
      },
      {
        key: "costPerNight",
        component: "input",
        placeholder: "هرشب اقامت",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "currency",
        component: "input",
        placeholder: "ارز هزینه",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "broker",
        component: "Select",
        placeholder: "کارگزار",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
    ],
    initialValues: {
      roomType: "",
      contractDateIn: "",
      contractDateOut: "",
    },
    validationSchema: Yup.object().shape({
      roomType: Yup.string().required(REQUIRED_TEXT),
      contractDateIn: Yup.string().required(REQUIRED_TEXT),
      contractDateOut: Yup.string().required(REQUIRED_TEXT),
    }),
    fetchFormValues: false,
    callbackSubmit: submitForm,
    form: useFormik({
      initialValues: {
        roomType: "",
        contractDateIn: "",
        contractDateOut: "",
        clientName: "",
      },
      onSubmit: async () => {},
    }),
  };

  const hotelForm: FormExtenderInterface = {
    title: "اقامتگاه",
    name: "accommodation",
    fields: [
      {
        key: "country",
        component: "Select",
        placeholder: "کشور",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
        options: countries,
      },
      {
        key: "city",
        component: "Select",
        placeholder: "شهر",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
        options: cities,
      },
      {
        key: "accommodationType",
        component: "Select",
        placeholder: "نوع اقامت",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
      },
      {
        key: "hotelName",
        component: "Select",
        placeholder: "نام هتل",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
        options: hotels,
      },
      {
        key: "serviceType",
        component: "list-preview",
        title: "نوع خدمات",
        options: serviceTypes,
      },

      {
        key: "voucherFile",
        component: "file",
        placeholder: "",
        type: "file",
        floating: true,
        icon: "/icons/vector.png",
        className: "w-full",
      },
      {
        component: "file-preview",
        key: "filePreview",
        dependantKey: "voucherFile",
        className: "w-full",
      },
    ],
    initialValues: {
      country: "",
      city: "",
      hotelName: "",
      serviceType: "",
      voucherFile: "",
    },
    validationSchema: Yup.object().shape({
      province: Yup.string().required(REQUIRED_TEXT),
      city: Yup.string().required(REQUIRED_TEXT),
      street: Yup.string().required(REQUIRED_TEXT),
      postalCode: Yup.string().required(REQUIRED_TEXT),
      category: Yup.string().required(REQUIRED_TEXT),
      address: Yup.string().required(REQUIRED_TEXT),
    }),
    fetchFormValues: false,
    callbackSubmit: submitForm,
  };

  // function submitForm(key: string, data: any) {
  //   formValues = {
  //     ...formValues,
  //     [key]: data,
  //   };
  //   setFetchFormValues(false);
  // }
  const { mutate: hotelSubmitter } = useMutation({
    mutationFn: (data: any) => {
      return sendHotelData(data, Number(id));
    },
    onSuccess: () => {},
  });
  function submitForm(data: any, name: string) {
    if (name === "accommodation") {
      console.log("accommodation");
      console.log("🚀 ~ submitForm ~ data.voucherFile:", data.voucherFile[0]);
      hotelSubmitter({
        accommodationId: data.hotelName,

        serviceTypeId: data.serviceType,
        files: data.voucherFile,
      });
    } else if (name === "room") {
      console.log("room");
    }
  }
  // const purchaseFormik = useFormik({
  //   initialValues: {
  //     costPerNight: "",
  //     currency: "",
  //     broker: "",
  //   },
  //   onSubmit: async () => {},
  // });

  return (
    <div className="w-full bg-card rounded-lg">
      <div className="w-full p-4">
        <div className="flex flex-row text-xs md:text-sm md:p-4 md:gap-4 font-foreground"></div>

        {!isLoading ? (
          <FormExtender
            key={hotelForm.title}
            {...hotelForm}
            // fetchFormValues={fetchFormValues}
            wrapperClassName="flex-row flex-wrap"
            childrenClassName="order-last"
            childrenData={roomForm}
          />
        ) : (
          <></>
        )}
        {/* <FormExtender
            key={roomForm.title}
            {...roomForm}
            fetchFormValues={fetchFormValues}
            wrapperClassName="flex-row flex-wrap"
            childrenClassName="order-first"
            extenderBtnClassName="hidden"
          >
            <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
              <div className="px-2 font-foreground font-semibold">خرید</div>
              <FormMaker form={purchaseFormik} fields={purchaseInfo} />
            </div>
          </FormExtender> */}

        <div className="flex flex-col gap-4 px-4">
          {/* <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
            <div className="px-2 font-foreground font-semibold">خرید</div>
            <FormMaker form={purchaseFormik} fields={purchaseInfo} />
          </div> */}
          <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
            <div className="px-2 font-foreground font-semibold">
              اطلاعات مشتری (ثبت کننده)
            </div>
            <RegisteryForm
              submitForm={SubmitterHandler}
              accountant={
                contract?.userResponsible?.id
                  ? contract?.userResponsible?.id.toString()
                  : ""
              }
              accountantOptions={userOptions}
              className="flex-row"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

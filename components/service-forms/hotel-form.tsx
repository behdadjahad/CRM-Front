import { REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";
import FormExtender, { FormExtenderInterface } from "../shared/form-extender";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAccommodationTypes,
  getRooms,
  getServiceTypes,
  sendHotelData,
  sendRoomData,
} from "@/api/accommodation";
import { getHotels } from "@/api/accommodation";
import { OptionType } from "../shared/form-maker";
import { useParams } from "next/navigation";
import RegisteryForm from "../contract/registery-form";
import { insertSubmitterData } from "@/api/client";
import { getUsers } from "@/api/auth";
import { getContractById } from "@/api/contract";
import { getCurrencies } from "@/api/currency";
import { convertToGregorian } from "@/lib/date";

export default function HotelForm() {
  const [serviceTypes, setServiceTypes] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);
  const [hotels, setHotels] = useState<OptionType[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [accommodationTypes, setAccommodationTypes] = useState<OptionType[]>(
    []
  );
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [roomTypes, setRoomTypes] = useState<OptionType[]>([]);
  const [hotelId, setHotelId] = useState<number>();
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
  const { data: accommodationType } = useQuery({
    queryKey: ["accomodationType"],
    queryFn: () => getAccommodationTypes(),
  });
  const { data: currency } = useQuery({
    queryKey: ["Currency"],
    queryFn: () => getCurrencies(),
  });
  useEffect(() => {
    if (currency) {
      const currencyOptions = currency.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setCurrencies(currencyOptions);
    
    }
  }, [currency]);
  const { data: roomType } = useQuery({
    queryKey: ["roomType"],
    queryFn: () => getRooms(),
  });
  useEffect(() => {
    if (roomType) {
      const roomOptions = roomType.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setRoomTypes(roomOptions);
 
    }
  }, [roomType]);
  useEffect(() => {
    if (accommodationType) {
      const accommodationOptions = accommodationType.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setAccommodationTypes(accommodationOptions);
    }
  }, [accommodationType]);
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
        key: "roomCount",
        component: "input",
        type: "number",
        placeholder: "تعداد اتاق",
        floating: true,
        className: "w-full md:w-1/4",
      },
      {
        key: "roomType",
        component: "Select",
        placeholder: "نوع اتاق",
        type: "text",
        floating: true,
        className: "w-full md:w-1/4",
        options: roomTypes,
      },
      {
        key: "contractDateIn",
        dependantKey: "checkInDateType",
        component: "date",
        placeholder: "چک این",
        type: "text",
        floating: true,
        className: "w-full md:w-1/4",
      },
      {
        key: "contractDateOut",
        dependantKey: "checkOutDateType",
        component: "date",
        placeholder: "چک اوت",
        type: "text",
        floating: true,
        className: "w-full md:w-1/4",
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
        component: "Select",
        placeholder: "ارز هزینه",
        type: "text",
        floating: true,
        className: "w-full md:w-1/3",
        options: currencies,
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
      roomCount: "",
      roomType: "",
      contractDateIn: "",
      contractDateOut: "",
      costPerNight: "",
      currency: "",
      broker: "",
    },
    validationSchema: Yup.object().shape({
      roomType: Yup.string().required(REQUIRED_TEXT),
      contractDateIn: Yup.string().required(REQUIRED_TEXT),
      contractDateOut: Yup.string().required(REQUIRED_TEXT),
      costPerNight: Yup.string().required(REQUIRED_TEXT),
      currency: Yup.string().required(REQUIRED_TEXT),
      broker: Yup.string().required(REQUIRED_TEXT),
    }),
    fetchFormValues: false,
    callbackSubmit: submitForm,
    // form: useFormik({
    //   initialValues: {
    //     roomType: "",
    //     contractDateIn: "",
    //     contractDateOut: "",
    //     costPerNight: "",
    //     currency: "",
    //     broker: "",
    //     hotelId:"",
    //   },
    //   onSubmit: async () => {},
    // }),
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
        options: accommodationTypes,
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
    onSuccess: (data) => {
    
      setHotelId(data.id);
      roomForm.initialValues.hotelId = data.id;
    },
  });
  const { mutate: roomSubmitter } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) =>
      sendRoomData(data, id),
    onSuccess: (data) => {
   console.log(data)
    },
  });
  function submitForm(data: any, name: string) {
    if (name === "accommodation") {
      hotelSubmitter({
        accommodationId: data.hotelName,
        serviceTypeId: data.serviceType,
        files: data.voucherFile,
      });
    } else if (name === "room") {
      // roomSubmitter({
      //   data: {
      //     acRoomTypeId: data.roomType,
      //     numberOfRooms: Number(data.roomCount),
      //     // numberOfNights: 1,
      //     checkInDate: convertToGregorian(
      //       data.contractDateIn,
      //       data.checkInDateType
      //     ),
      //     checkOutDate: convertToGregorian(
      //       data.contractDateOut,
      //       data.checkOutDateType
      //     ),
      //     // voucherNo: "string",
      //     // voucherPdf: "string",
      //     // priceWeBuyPerNight: 1,
      //     // currencyWeBuyExchangeRate: 1,
      //     // priceWeBuyPerNightInContractCurrency: 1,
      //     // totalBuyPrice: 1,
      //     // priceWeSell: 1,
      //     // currencyWeSellExchangeRate: 1,
      //     // priceWeSellInContractCurrency: 1,
      //     // totalSellPrice: 1,
      //     // currencyWeBuyId: 1,
      //     // currencyWeSellId: 1,
      //     contractCurrencyId: data.currency,
      //   },
      //   id: 10,
      // });
   
    }
    // roomCount:"",
    // roomType: "",
    // contractDateIn: "",
    // contractDateOut: "",
    // costPerNight: "",
    // currency: "",
    // broker: "",
    // hotelId:"",

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
            hotelId={hotelId}
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

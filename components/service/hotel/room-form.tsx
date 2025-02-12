import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRooms, sendRoomData } from "@/api/accommodation";
import { useEffect, useState } from "react";
import { getCurrencies } from "@/api/currency";
import Button from "react-multi-date-picker/components/button";
import { convertToGregorian } from "@/lib/date";
export interface RoomInterface{
  hotelId: number
}
export default function RoomForm({
  //id,
  hotelId }: any) {
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [roomTypes, setRoomTypes] = useState<OptionType[]>([]);
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
  const formik = useFormik({
    initialValues: {
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

    onSubmit: async () => {},
  });
  const { mutate: roomSubmitter } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) =>
      sendRoomData(data, id),
    onSuccess: (data) => {
      console.log(data);
    },
  });
  function submitForm(data: any) {
    console.log(data)
    roomSubmitter({
      data: {
        acRoomTypeId: data.roomType,
        numberOfRooms: Number(data.roomCount),
        // numberOfNights: 1,
        checkInDate: convertToGregorian(
          data.contractDateIn,
          data.checkInDateType
        ),
        checkOutDate: convertToGregorian(

          data.contractDateOut,
          data.checkOutDateType
        ),
        // voucherNo: "string",
        // voucherPdf: "string",
        priceWeBuyPerNight: Number(data.costPerNight),
        currencyWeBuyExchangeRate: 10,
        // priceWeBuyPerNightInContractCurrency: 1,
        // totalBuyPrice: 1,
        // priceWeSell: 1,
        // currencyWeSellExchangeRate: 1,
        // priceWeSellInContractCurrency: 1,
        // totalSellPrice: 1,
        // currencyWeBuyId: 1,
        // currencyWeSellId: 1,
        currencyWeBuyId: data.currency,
      },
      id: hotelId,
    });
  }

  return (
    <div className="bg-card flex flex-col gap-4">
      <h2>اقامتگاه</h2>
    <FormMaker
      form={formik}
      fields={[
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
        {
          component: "non-field",
          key: "actions",
          children: (
            <div className="flex flex-row items-center gap-2 justify-end w-full">
            <Button
                  variant="info"
                  onClick={() => {
                    submitForm(formik.values);
                  }}
                >
                    ثبت اتاق 
                </Button>
                <Button
                  onClick={() => {
                    // submitForm(formik.values);
                  }}
                >
                  حذف اتاق
                </Button>
            </div>
          ),
        },
      ]}
      className="flex flex-row w-full"
      />
      </div>
  );
}

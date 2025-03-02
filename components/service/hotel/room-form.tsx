import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { useFormik } from "formik";
import { formatPrice, REQUIRED_TEXT } from "@/lib/utils";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editRoomData, getRooms, sendRoomData } from "@/api/accommodation";
import { useEffect, useState } from "react";
import { getCurrencies } from "@/api/currency";
import { useQueryClient } from "@tanstack/react-query";
import { convertDate, convertToGregorian } from "@/lib/date";
import { Button } from "@/components/ui/button";
export interface RoomInterface {
  hotelId: number;
}
// http://185.126.203.246:3000/public
export default function RoomForm({ id, hotelId, onRemoveHandler, room }: any) {
  console.log(17, room);
  const queryClient = useQueryClient();
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
      roomType: room?.roomTypeId?.toString(),
      contractDateIn: room?.checkInDate
        ? convertDate(room?.checkInDate, "Solar")
        : "",
      contractDateOut: room?.checkOutDate
        ? convertDate(room?.checkOutDate, "Solar")
        : "",
      costPerNight:room?.priceWeBuyPerNight ? formatPrice(room?.priceWeBuyPerNight):"",
      currency: room?.currencyWeBuy?.toString(),
      broker: "",
      roomCount: room?.numberOfRooms,
      id: room?.id,
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
    enableReinitialize: true,
  });
  const { mutate: roomSubmitter } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) =>
      sendRoomData(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });

  const { mutate: roomEditor } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) =>
      editRoomData(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });

  function submitRoom(data: any) {
    console.log(room.isSubmitted);
    if (room.isSubmitted) {
      roomEditor({
        data: {
          roomTypeId: data.roomType,
          numberOfRooms: Number(data.roomCount),
          // checkInDate: convertToGregorian(
          //   data?.contractDateIn,
          //   data?.checkInDateType
          // ),
          // checkOutDate: convertToGregorian(
          //   data?.contractDateOut,
          //   data?.checkOutDateType
          // ),
          priceWeBuyPerNight: Number(data.costPerNight),
          currencyWeBuyExchangeRate: 10,
          currencyWeBuyId: data.currency,
        },
        id: data.id,
      });
    } else {
      roomSubmitter({
        data: {
          roomTypeId: data.roomType,
          numberOfRooms: Number(data.roomCount),
          checkInDate: convertToGregorian(
            data.contractDateIn,
            data.checkInDateType
          ),
          checkOutDate: convertToGregorian(
            data.contractDateOut,
            data.checkOutDateType
          ),
          priceWeBuyPerNight: Number(data.costPerNight),
          currencyWeBuyExchangeRate: 10,
          currencyWeBuyId: data.currency,
        },
        id: hotelId,
      });
    }
  }

  function removeForm(formId: string) {
    onRemoveHandler(formId);
  }
  return (
    <div className="bg-card flex flex-col gap-4">
      <h2>مدت اقامت</h2>
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
                    submitRoom(formik.values);
                  }}
                >
                  ثبت اتاق
                </Button>
                <Button
                  onClick={() => {
                    removeForm(id);
                  }}
                  className="text-danger border-danger"
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

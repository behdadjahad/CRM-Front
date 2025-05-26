import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cleanFormatPrice, cn, dateType, formatPrice } from "@/lib/utils";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import StopForm from "./stop-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAirportTerminal } from "@/api/ticket";
import { convertDateTime, convertDateTimeToGregorian } from "@/lib/date";
import { useParams } from "next/navigation";
import { editFlightData, sendFlightData } from "@/api/flight";
export default function RoundTripTicketForm({
  flightClassOptions,
  flightTypeOptions,
  airports,
  airlines,
  ticket,
  onRemoveHandler,
  currencies,
}: {
  flightTypeOptions: any;
  flightClassOptions: any;
  airports: OptionType[];
  airlines: OptionType[];
  ticket: any;
  onRemoveHandler: any;
  currencies: any;
}) {
  const formik = useFormik({
    initialValues: {
      originCityAirport: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 1)
        ?.originCityAirport?.toString(),
      originTerminal: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 1)
        ?.originTerminal?.toString(),
      exitDateTime: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.exitDateTime
        ? convertDateTime(
            ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
              ?.exitDateTime,
            dateType
          )
        : "",
      arriveDateTime: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.arriveDateTime
        ? convertDateTime(
            ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
              ?.exitDateTime,
            dateType
          )
        : "",
      exitDateTimeType: dateType,
      arriveDateTimeType:dateType,
      destinationCityAirport: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 1)
        ?.destinationCityAirport?.toString(),
      destinationTerminal: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 1)
        ?.destinationTerminal?.toString(),
      airline: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 1)
        ?.airline?.toString(),
      cost: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)?.cost ? formatPrice(ticket?.flights?.find((obj: any) => obj.groupOrder === 1)?.cost):"",
      currency: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.currency,
      broker: "",
      flightId: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.flightId,
      flightClass: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.flightClass,
      flightType: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.flightType,
      isSubmitted: ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
        ?.isSubmitted,
      flightGroupId: ticket?.isSubmitted ? ticket?.id : null,
      travelType: ticket?.ticketType || "TwoWay",
      groupOrder: 1,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const returnFormik = useFormik({
    initialValues: {
      returnOriginCityAirport: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.originCityAirport?.toString(),
      returnOriginTerminal: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.originTerminal?.toString(),
      returnExitDateTime: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.exitDateTime?.toString()
        ? convertDateTime(
            ticket?.flights
              ?.find((obj: any) => obj.groupOrder === 2)
              ?.exitDateTime?.toString(),
            dateType
          )
        : "",
      returnArriveDateTime: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.arriveDateTime?.toString()
        ? convertDateTime(
            ticket?.flights
              ?.find((obj: any) => obj.groupOrder === 2)
              ?.arriveDateTime?.toString(),
            dateType
          )
        : "",
      returnExitDateTimeType: dateType,
      returnArriveDateTimeType: dateType,
      returnDestinationCityAirport: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.destinationCityAirport?.toString(),
      returnDestinationTerminal: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.destinationTerminal?.toString(),
      returnAirline: ticket?.flights
        ?.find((obj: any) => obj.groupOrder === 2)
        ?.airline?.toString(),
      returnCost: ticket?.flights?.find((obj: any) => obj.groupOrder === 2)
        ?.cost ? formatPrice(ticket?.flights?.find((obj: any) => obj.groupOrder === 2)
        ?.cost):"",
      returnBroker: "",
      returnCurrency: ticket?.flights?.find((obj: any) => obj.groupOrder === 2)
        ?.currency,
      returnFlightClass: ticket?.flights?.find(
        (obj: any) => obj.groupOrder === 2
      )?.flightClass,
      returnFlightType: ticket?.flights?.find(
        (obj: any) => obj.groupOrder === 2
      )?.flightType,
      flightId: ticket?.flights?.find((obj: any) => obj.groupOrder === 2)
        ?.flightId,
      isSubmitted: ticket?.flights?.find((obj: any) => obj.groupOrder === 2)
        ?.isSubmitted,
      flightGroupId: ticket?.isSubmitted ? ticket?.id : null,
      travelType: ticket?.ticketType || "TwoWay",
      groupOrder: 2,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const [addedStops, setAddedStops] = useState<any[]>([]);
  const [addedReturnStops, setAddedReturnStops] = useState<any[]>([]);
  const [originTerminals, setOriginTerminals] = useState<OptionType[]>([]);
  const [destinationTerminals, setDestinationTerminals] = useState<
    OptionType[]
  >([]);
  const [returnOriginTerminals, setReturnOriginTerminals] = useState<
    OptionType[]
  >([]);
  const [returnDestinationTerminals, setReturnDestinationTerminals] = useState<
    OptionType[]
  >([]);
  const { id } = useParams();
  function addStopForm() {
    setAddedStops([
      ...addedStops,
      {
        stopId: `stop-${addedStops.length + 1}`,
        isSubmitted: false,
      },
    ]);
  }
  function addReturnStopForm() {
    setAddedReturnStops([
      ...addedReturnStops,
      {
        stopId: `returnStop-${addedReturnStops.length + 1}`,
        isSubmitted: false,
      },
    ]);
  }

  function removeHandler(formId: any) {
    const updatedAddedStops = addedStops.filter(
      (item) => item.stopId != formId
    );
    setAddedStops(updatedAddedStops);
  }
  function removeReturnHandler(formId: any) {
    const updatedAddedStops = addedReturnStops.filter(
      (item) => item.stopId != formId
    );
    setAddedReturnStops(updatedAddedStops);
  }
  const { mutate: SubmitOriginAirportHandler } = useMutation({
    mutationFn: (id: number) => {
      return getAirportTerminal(id);
    },
    onSuccess: (response) => {
      const originTerminalOptions: OptionType[] = response.data.map(
        (item: any) => ({
          label: item.name,
          value: item.id.toString(),
        })
      );
      setOriginTerminals(originTerminalOptions);
    },
  });
  const { mutate: SubmitDestinationAirportHandler } = useMutation({
    mutationFn: (id: number) => {
      return getAirportTerminal(id);
    },
    onSuccess: (response) => {
      const destinationTerminalOptions: OptionType[] = response?.data.map(
        (item: any) => ({
          label: item.name,
          value: item.id.toString(),
        })
      );
      setDestinationTerminals(destinationTerminalOptions);
    },
  });
  const { mutate: SubmitReturnOriginAirportHandler } = useMutation({
    mutationFn: (id: number) => {
      return getAirportTerminal(id);
    },
    onSuccess: (response) => {
      const returnOriginTerminalOptions: OptionType[] = response.data.map(
        (item: any) => ({
          label: item.name,
          value: item.id.toString(),
        })
      );
      setReturnOriginTerminals(returnOriginTerminalOptions);
    },
  });
  const { mutate: SubmitReturnDestinationAirportHandler } = useMutation({
    mutationFn: (id: number) => {
      return getAirportTerminal(id);
    },
    onSuccess: (response) => {
      const returnDestinationTerminalOptions: OptionType[] = response?.data.map(
        (item: any) => ({
          label: item.name,
          value: item.id.toString(),
        })
      );
      setReturnDestinationTerminals(returnDestinationTerminalOptions);
    },
  });
  useEffect(() => {
    if (formik.values.originCityAirport) {
      SubmitOriginAirportHandler(Number(formik.values.originCityAirport));
    }
  }, [formik.values.originCityAirport]);

  useEffect(() => {
    if (formik.values.destinationCityAirport) {
      SubmitDestinationAirportHandler(
        Number(formik.values.destinationCityAirport)
      );
    }
  }, [formik.values.destinationCityAirport]);
  useEffect(() => {
    if (returnFormik.values.returnDestinationCityAirport) {
      SubmitReturnDestinationAirportHandler(
        Number(returnFormik.values.returnDestinationCityAirport)
      );
    }
  }, [returnFormik.values.returnDestinationCityAirport]);

  useEffect(() => {
    if (returnFormik.values.returnOriginCityAirport) {
      SubmitReturnOriginAirportHandler(
        Number(returnFormik.values.returnOriginCityAirport)
      );
    }
  }, [returnFormik.values.returnOriginCityAirport]);
  const { mutate: submitFlightForm } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return sendFlightData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  const { mutate: editFlightForm } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editFlightData(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  function submitHandler() {
    const data = {
      travelType: formik.values.travelType,
      flightGroupId: formik.values.flightGroupId,
      baseTerminalId: formik.values.originTerminal,
      baseStationId: formik.values.originCityAirport,
      destinationTerminalId: formik.values.destinationTerminal,
      destinationStationId: formik.values.destinationCityAirport,
      ticketClassId: formik.values.flightClass,
      ticketKindId: formik.values.flightType,
      exiteDateTime: convertDateTimeToGregorian(
        formik.values.exitDateTime,
        formik.values.exitDateTimeType
      ),
      arriveDateTime: convertDateTimeToGregorian(
        formik.values.arriveDateTime,
        formik.values.arriveDateTimeType
      ),
      transportationCoId: formik.values.airline,
      groupOrder: formik.values.groupOrder,
      priceWeBuy: cleanFormatPrice(formik.values.cost),
      currencyWeBuyId: formik.values.currency,
    };
    if (!formik.values.isSubmitted) {
      submitFlightForm({
        id: Number(id),
        data: data,
      });
    } else {
      editFlightForm({
        id: formik.values.flightId,
        data: data,
      });
    }
  }
  function returnSubmitHandler() {
    const data = {
      travelType: returnFormik.values.travelType,
      flightGroupId: returnFormik.values.flightGroupId,
      baseTerminalId: returnFormik.values.returnOriginTerminal,
      baseStationId: returnFormik.values.returnOriginCityAirport,
      destinationTerminalId: returnFormik.values.returnDestinationTerminal,
      destinationStationId: returnFormik.values.returnDestinationCityAirport,
      ticketClassId: returnFormik.values.returnFlightClass,
      ticketKindId: returnFormik.values.returnFlightType,
      exiteDateTime: convertDateTimeToGregorian(
        returnFormik.values.returnExitDateTime,
        returnFormik.values.returnExitDateTimeType
      ),
      arriveDateTime: convertDateTimeToGregorian(
        returnFormik.values.returnArriveDateTime,
        returnFormik.values.returnArriveDateTimeType
      ),
      transportationCoId: returnFormik.values.returnAirline,
      groupOrder: returnFormik.values.groupOrder,
      priceWeBuy: cleanFormatPrice(returnFormik.values.returnCost),
      currencyWeBuyId: returnFormik.values.returnCurrency,
    };
    if (!returnFormik.values.isSubmitted) {
      submitFlightForm({
        id: Number(id),
        data: data,
      });
    } else {
      editFlightForm({
        id: returnFormik.values.flightId,
        data: data,
      });
    }
  }
  useEffect(() => {
    if (
      ticket?.flights?.find((obj: any) => obj.groupOrder === 1)?.flightStops &&
      ticket?.flights?.find((obj: any) => obj.groupOrder === 1)?.flightStops
        .length > 0
    ) {
      setAddedStops(
        ticket?.flights?.find((obj: any) => obj.groupOrder === 1)?.flightStops
      );
    }
  }, [ticket?.flights?.find((obj: any) => obj.groupOrder === 1)?.flightStops]);
  useEffect(() => {
    if (
      ticket?.flights?.find((obj: any) => obj.groupOrder === 2)?.flightStops &&
      ticket?.flights?.find((obj: any) => obj.groupOrder === 2)?.flightStops
        .length > 0
    ) {
      setAddedReturnStops(
        ticket?.flights?.find((obj: any) => obj.groupOrder === 2)?.flightStops
      );
    }
  }, [ticket?.flights?.find((obj: any) => obj.groupOrder === 2)?.flightStops]);

  return (
    <>
      <div className="flex flex-col gap-4 border border-gray-400 rounded-md p-3">
        <div className="flex items-center gap-2">
          <h2 className="p-3">رفت</h2>
          <Button
            variant={"transparent"}
            onClick={addStopForm}
            className={cn(
              "w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
            )}
          >
            <FaPlus className="text-white" />
          </Button>
        </div>
        <FormMaker
          form={formik}
          fields={[
            {
              key: "originCityAirport",
              component: "Select",
              placeholder: "مبدا(شهر،فرودگاه)",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: airports,
            },
            {
              key: "originTerminal",
              component: "Select",
              placeholder: "ترمینال مبدا",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: originTerminals,
            },
            {
              key: "exitDateTime",
              dependantKey: "exitDateTimeType",
              component: "date-time",
              placeholder: "تاریخ و ساعت",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
            },
            {
              key: "destinationCityAirport",
              component: "Select",
              placeholder: "مقصد(شهر،فرودگاه)",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: airports,
            },
            {
              key: "destinationTerminal",
              component: "Select",
              placeholder: "ترمینال مقصد",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: destinationTerminals,
            },
            {
              key: "arriveDateTime",
              dependantKey: "arriveDateTimeType",
              component: "date-time",
              placeholder: "تاریخ و ساعت",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
            },
            {
              key: "airline",
              component: "Select",
              placeholder: "ایرلاین",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: airlines,
            },
            {
              key: "flightClass",
              component: "list-preview",
              title: "کلاس پرواز",
              options: flightClassOptions,
            },
            {
              key: "flightType",
              component: "list-preview",
              title: "نوع پرواز",
              options: flightTypeOptions,
            },
            {
              component: "non-field",
              key: "title",
              children: (
                <h2 className="w-full border-t-4 border-dashed pt-3">خرید</h2>
              ),
            },

            {
              key: "cost",
              component: "input",
              placeholder: "هزینه",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              formatted:true
            },

            {
              key: "currency",
              component: "Select",
              placeholder: "ارزهزینه",
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
                  <Button variant="info" onClick={submitHandler}>
                    ثبت پرواز
                  </Button>
                  <Button
                    onClick={() => {
                      onRemoveHandler(formik.values.flightId);
                    }}
                    className="text-danger border-danger"
                  >
                    حذف پرواز
                  </Button>
                </div>
              ),
            },
          ]}
          className=""
        />

        {addedStops.map((item) => (
          <StopForm
            key={item.id}
            onRemoveHandler={removeHandler}
            flightId={
              ticket?.flights?.find((obj: any) => obj.groupOrder === 1)
                ?.flightId
            }
            airports={airports}
            flight={ticket?.flights?.find((obj: any) => obj.groupOrder === 1)}
            stop={item}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 border border-gray-400 rounded-md p-3">
        <div className="flex items-center gap-2">
          <h2 className="p-3">برگشت</h2>
          <Button
            variant={"transparent"}
            onClick={addReturnStopForm}
            className={cn(
              "w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
            )}
          >
            <FaPlus className="text-white" />
          </Button>
        </div>
        <FormMaker
          form={returnFormik}
          fields={[
            {
              key: "returnOriginCityAirport",
              component: "Select",
              placeholder: "مبدا(شهر،فرودگاه)",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: airports,
            },
            {
              key: "returnOriginTerminal",
              component: "Select",
              placeholder: "ترمینال مبدا",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: returnOriginTerminals,
            },
            {
              key: "returnExitDateTime",
              dependantKey: "returnExitDateTimeType",
              component: "date-time",
              placeholder: "تاریخ و ساعت",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
            },

            {
              key: "returnDestinationCityAirport",
              component: "Select",
              placeholder: "مقصد(شهر،فرودگاه)",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: airports,
            },
            {
              key: "returnDestinationTerminal",
              component: "Select",
              placeholder: "ترمینال مقصد",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: returnDestinationTerminals,
            },
            {
              key: "returnArriveDateTime",
              dependantKey: "returnArriveDateTimeType",
              component: "date-time",
              placeholder: "تاریخ و ساعت",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
            },

            {
              key: "returnAirline",
              component: "Select",
              placeholder: "ایرلاین",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: airlines,
            },
            {
              key: "returnFlightClass",
              component: "list-preview",
              title: "کلاس پرواز",
              options: flightClassOptions,
            },
            {
              key: "returnFlightType",
              component: "list-preview",
              title: "نوع پرواز",
              options: flightTypeOptions,
            },
            {
              component: "non-field",
              key: "returnTitle",
              children: (
                <h2 className="w-full border-t-4 border-dashed pt-3">خرید</h2>
              ),
            },

            {
              key: "returnCost",
              component: "input",
              placeholder: "هزینه",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              formatted:true
            },

            {
              key: "returnCurrency",
              component: "Select",
              placeholder: "ارزهزینه",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
              options: currencies,
            },
            {
              key: "returnBroker",
              component: "Select",
              placeholder: "کارگزار",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
            },

            {
              component: "non-field",
              key: "returnActions",
              children: (
                <div className="flex flex-row items-center gap-2 justify-end w-full">
                  <Button variant="info" onClick={returnSubmitHandler}>
                    ثبت پرواز
                  </Button>
                  <Button
                    onClick={() => {
                      onRemoveHandler(returnFormik.values.flightId);
                    }}
                    className="text-danger border-danger"
                  >
                    حذف پرواز
                  </Button>
                </div>
              ),
            },
          ]}
          className=""
        />

        {addedReturnStops.map((item) => (
          <StopForm
            key={item.id}
            onRemoveHandler={removeReturnHandler}
            flightId={
              ticket?.flights?.find((obj: any) => obj.groupOrder === 2)
                ?.flightId
            }
            airports={airports}
            flight={ticket?.flights?.find((obj: any) => obj.groupOrder === 2)}
            stop={item}
          />
        ))}
      </div>
    </>
  );
}

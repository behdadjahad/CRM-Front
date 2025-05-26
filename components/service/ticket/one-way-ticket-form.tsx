import { useFormik } from "formik";
import FormMaker, { OptionType } from "../../shared/form-maker";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { cleanFormatPrice, cn, dateType, formatPrice } from "@/lib/utils";
import StopForm from "./stop-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAirportTerminal } from "@/api/ticket";
import { editFlightData, sendFlightData } from "@/api/flight";
import { useParams } from "next/navigation";
import { convertDateTime, convertDateTimeToGregorian } from "@/lib/date";
export default function OneWayTicketForm({
  onRemoveHandler,
  flightClassOptions,
  flightTypeOptions,
  airports,
  airlines,
  ticket,
  currencies,
}: {
  onRemoveHandler: any;
  flightClassOptions: any;
  flightTypeOptions: any;
  airports: OptionType[];
  airlines: OptionType[];
  ticket: any;
  currencies: OptionType[];
}) {
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      originCityAirport: ticket?.flights?.[0]?.originCityAirport?.toString(),
      originTerminal: ticket?.flights?.[0]?.originTerminal?.toString(),
      exitDateTime:
        ticket?.flights?.[0]?.exitDateTime &&
        convertDateTime(ticket?.flights?.[0]?.exitDateTime, dateType),
      exitDateTimeType: dateType,
      arriveDateTime:
        ticket?.flights?.[0]?.arriveDateTime &&
        convertDateTime(ticket?.flights?.[0]?.arriveDateTime, dateType),
      arriveDateTimeType: dateType,
      destinationCityAirport:
        ticket?.flights?.[0]?.destinationCityAirport?.toString(),
      destinationTerminal:
        ticket?.flights?.[0]?.destinationTerminal?.toString(),
      airline: ticket?.flights?.[0]?.airline?.toString(),
      cost: ticket?.flights?.[0]?.cost ? formatPrice(ticket?.flights?.[0]?.cost):"",
      currency: ticket?.flights?.[0]?.currency,
      broker: "",
      flightId: ticket?.flights?.[0]?.flightId || ticket?.id,
      flightClass: ticket?.flights?.[0]?.flightClass,
      flightType: ticket?.flights?.[0]?.flightType,
      isSubmitted: ticket?.flights?.[0]?.isSubmitted,
      flightGroupId: ticket.isSubmitted ? ticket?.id : null,
      travelType: ticket?.ticketType || "OneWay",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const { id } = useParams();
  const [originTerminals, setOriginTerminals] = useState<OptionType[]>([]);
  const [destinationTerminals, setDestinationTerminals] = useState<
    OptionType[]
  >([]);

  const [addedStops, setAddedStops] = useState<any[]>([]);
  function addStopForm() {
    setAddedStops([
      ...addedStops,
      {
        stopId: `stop-${addedStops.length + 1}`,
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
  function removeTicketForm(formId: any) {
    onRemoveHandler(formId);
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
  useEffect(() => {
    if (
      ticket?.flights?.[0]?.flightStops &&
      ticket?.flights?.[0]?.flightStops?.length > 0
    ) {
      setAddedStops(ticket?.flights?.[0]?.flightStops);
    }
  }, [ticket?.flights?.[0]?.flightStops]);
  return (
    <div className="flex flex-col gap-4 border border-gray-400 rounded-md p-3">
      <div className="flex items-center gap-2">
        <h2 className="p-3">یک طرفه</h2>
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
          // {
          //   key: "dateTime",
          //   component: "date",
          //   placeholder: "تاریخ و ساعت",
          //   type: "text",
          //   floating: true,
          //   className: "w-full md:w-1/3",
          // },
          {
            key: "exitDateTime",
            component: "date-time",
            dependantKey: "exitDateTimeType",
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
            component: "date-time",
            dependantKey: "arriveDateTimeType",
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
                  ثبت بلیط
                </Button>
                <Button
                  onClick={() => {
                    removeTicketForm(formik.values.flightId);
                  }}
                  className="text-danger border-danger"
                >
                  حذف بلیط
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
          flightId={ticket?.flights?.[0]?.flightId}
          airports={airports}
          flight={ticket?.flights?.[0]}
          stop={item}
        />
      ))}
    </div>
  );
}

import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import StopForm from "./stop-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAirportTerminal } from "@/api/ticket";
import { convertDateTimeToGregorian } from "@/lib/date";
import { editFlightData, sendFlightData } from "@/api/flight";
import { useParams } from "next/navigation";

export default function FlightForm({
  onRemoveHandler,
  flightClassOptions,
  flightTypeOptions,
  count,
  airlines,
  airports,
  flight,
  ticket,
}: {
  onRemoveHandler: any;
  flightClassOptions: any;
  flightTypeOptions: any;
  count: any;
  airlines: OptionType[];
  airports: OptionType[];
  flight: any;
  ticket: any;
}) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      originCityAirport: flight?.originCityAirport?.toString(),
      originTerminal: flight?.originTerminal?.toString(),
      exitDateTime: flight?.exitDateTime?.toString(),
      arriveDateTime: flight?.arriveDateTime?.toString(),
      exitDateTimeType: "",
      arriveDateTimeType: "",
      destinationCityAirport: flight?.destinationCityAirport?.toString(),
      destinationTerminal: flight?.destinationTerminal?.toString(),
      airline: "",
      cost: "",
      currency: "",
      broker: "",
      flightType: flight?.flightType,
      flightClass: flight?.flightClass,
      flightId: flight?.flightId,
      isSubmitted: flight?.isSubmitted,
      flightGroupId: ticket.isSubmitted ? ticket?.id : null,
      travelType: ticket?.ticketType || "MultiWay",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const [addedStops, setAddedStops] = useState<any[]>([]);
  const [originTerminals, setOriginTerminals] = useState<OptionType[]>([]);
  const [destinationTerminals, setDestinationTerminals] = useState<
    OptionType[]
  >([]);
  function addStopForm() {
    setAddedStops([
      ...addedStops,
      {
        stopId: `stop-${addedStops.length + 1}`,
        isSubmitted:false
      },
    ]);
  }

  function removeForm(formId: any) {
    onRemoveHandler(formId);
  }

  function removeHandler(formId: any) {
    const updatedAddedFlights = addedStops.filter((item) => item.id != formId);
    setAddedStops(updatedAddedFlights);
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
    if (flight?.flightStops && flight?.flightStops.length > 0) {
      setAddedStops(flight?.flightStops);
    } else {
      setAddedStops([]);
    }
  }, [flight?.flightStops]);
  return (
    <div className="flex flex-col gap-4 border border-gray-400 rounded-md p-3">
      <div className="flex items-center gap-2">
        <h2 className="p-3">
          پرواز شماره <span>{count}</span>
        </h2>
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
          },

          {
            key: "currency",
            component: "Select",
            placeholder: "ارزهزینه",
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
                    removeForm(flight.flightId);
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
         
          flightId={flight?.flightId}
          airports={airports}
          flight={flight}
          stop={item}
        />
      ))}
    </div>
  );
}

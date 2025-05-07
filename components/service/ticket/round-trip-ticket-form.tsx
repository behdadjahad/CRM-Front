import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import StopForm from "./stop-form";
import { useMutation } from "@tanstack/react-query";
import { getAirportTerminal } from "@/api/ticket";
import { convertDateTimeToGregorian } from "@/lib/date";
import { useParams } from "next/navigation";
import { sendFlightData } from "@/api/flight";
export default function RoundTripTicketForm({
  //itemId,
  flightClassOptions,
  flightTypeOptions,
  airports,
  airlines,
  ticket,
}: {
  itemId: any;
  flightTypeOptions: any;
  flightClassOptions: any;
  airports: OptionType[];
  airlines: OptionType[];
  ticket: any;
}) {

  const formik = useFormik({
    initialValues: {
      originCityAirport: ticket?.flights?.[0]?.originCityAirport?.toString(),
      originTerminal: ticket?.flights?.[0]?.originTerminal?.toString(),
      exitDateTime: ticket?.flights?.[0]?.exitDateTime?.toString(),
      arriveDateTime: ticket?.flights?.[0]?.arriveDateTime?.toString(),
      destinationCityAirport:
        ticket?.flights?.[0]?.destinationCityAirport?.toString(),
      destinationTerminal:
        ticket?.flights?.[0]?.destinationTerminal?.toString(),
      airline: "",
      cost: "",
      currency: "",
      broker: "",
      id: ticket?.flights?.[0]?.flightId,
      flightClass: "",
      flightType: ticket?.flights?.[0]?.flightType?.toString(),
      isSubmitted: ticket?.flights?.[0]?.isSubmitted,
      flightGroupId:ticket?.isSubmitted ? ticket?.id:null,
      travelType: ticket?.ticketType || "TwoWay",
      groupOrder: 1,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const returnFormik = useFormik({
    initialValues: {
      returnOriginCityAirport:
        ticket?.flights?.[1]?.originCityAirport?.toString(),
      returnOriginTerminal: ticket?.flights?.[1]?.originTerminal?.toString(),
      returnExitDateTime: ticket?.flights?.[1]?.exitDateTime?.toString(),
      returnArriveDateTime: ticket?.flights?.[1]?.arriveDateTime?.toString(),
      returnDestinationCityAirport:
        ticket?.flights?.[1]?.destinationCityAirport?.toString(),
      returnDestinationTerminal:
        ticket?.flights?.[1]?.destinationTerminal?.toString(),
      returnAirline: "",
      returnCost: "",
      returnBroker: "",
      returnCurrency: "",
      returnFlightClass: "",
      returnFlightType: ticket?.flights?.[1]?.flightType?.toString(),
      id: ticket?.flights?.[1]?.flightId,
      isSubmitted: ticket?.flights?.[1]?.isSubmitted,
      flightGroupId:ticket?.isSubmitted ? ticket?.id:null,
      travelType: ticket?.ticketType || "TwoWay",
      groupOrder: 2,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

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
        id: `stop-${addedStops.length + 1}`,
      },
    ]);
  }
  function addReturnStopForm() {
    setAddedReturnStops([
      ...addedReturnStops,
      {
        id: `returnStop-${addedReturnStops.length + 1}`,
      },
    ]);
  }

  function removeHandler(formId: any) {
    const updatedAddedFlights = addedStops.filter((item) => item.id != formId);
    setAddedStops(updatedAddedFlights);
  }
  function removeReturnHandler(formId: any) {
    const updatedAddedFlights = addedReturnStops.filter(
      (item) => item.id != formId
    );
    setAddedReturnStops(updatedAddedFlights);
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
    onSuccess: () => {},
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
        "Solar"
      ),
      arriveDateTime: convertDateTimeToGregorian(
        formik.values.arriveDateTime,
        "Gregorian"
      ),
      // arriveDateTime: "2000-01-01T00:00:00Z",

      // exiteDateTime: "2000-01-01T00:00:00Z",
      groupOrder: formik.values.groupOrder,
    };
    submitFlightForm({
      id: Number(id),
      data: data,
    });
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
        "Solar"
      ),
      arriveDateTime: convertDateTimeToGregorian(
        returnFormik.values.returnArriveDateTime,
        "Gregorian"
      ),
      // arriveDateTime: "2000-01-01T00:00:00Z",

      // exiteDateTime: "2000-01-01T00:00:00Z",
      flightGroupOrder: returnFormik.values.groupOrder,
    };
    submitFlightForm({
      id: Number(id),
      data: data,
    });
  }
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
                    onClick={() => {}}
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
            itemId={item.id}
            flightId={ticket?.flights?.[0]?.flightId}
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
            },

            {
              key: "returnCurrency",
              component: "Select",
              placeholder: "ارزهزینه",
              type: "text",
              floating: true,
              className: "w-full md:w-1/3",
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
                    onClick={() => {}}
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
            itemId={item.id}
            flightId={ticket?.flights?.[1]?.flightId}
          />
        ))}
      </div>
    </>
  );
}

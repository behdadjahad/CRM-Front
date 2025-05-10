import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TicketForm from "./ticket-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import { getTicketData } from "@/api/ticket";
import { deleteFlightData, getAirlinesData, getFightClassData, getFightTypeData } from "@/api/flight";
import { getTransportationTypeId } from "@/api/transportation";
import { OptionType } from "@/components/shared/form-maker";

export default function TicketContainer({
  transportationType,
}: {
  transportationType: string;
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [addedTickets, setAddedTickets] = useState<any[]>([]);
  useEffect(() => {
    if (transportationType) {
      getTransportationType();
    }
  }, [transportationType]);
   const [flightClasses, setFlightClasses] = useState<OptionType[]>([]);
    const [flightTypes, setFlightTypes] = useState<OptionType[]>([]);
    const [airlines, setAirlines] = useState<OptionType[]>([]);
   const { mutate: getTransportationType } = useMutation({
      mutationFn: () => {
        return getTransportationTypeId(transportationType);
      },
      onSuccess: (response) => {
        if (response.id) {
          getFlightClass(response.id);
          getFlightType(response.id);
          getAirlines(response.id);
        }
      },
    });
    const { mutate: getFlightClass } = useMutation({
      mutationFn: (item: number) => {
        return getFightClassData(item);
      },
      onSuccess: (response) => {
        if (response.data && response.data.length > 0) {
          const flightClassOptions = response?.data?.map((item: any) => ({
            value: item?.id.toString(),
            label: item?.name,
          }));
          setFlightClasses(flightClassOptions);
        }
      },
    });
    const { mutate: getFlightType } = useMutation({
      mutationFn: (item: number) => {
        return getFightTypeData(item);
      },
      onSuccess: (response) => {
        if (response.data && response.data.length > 0) {
          const flightTypeOptions = response?.data?.map((item: any) => ({
            value: item?.id.toString(),
            label: item?.name,
          }));
          setFlightTypes(flightTypeOptions);
        }
      },
    });
    const { mutate: getAirlines } = useMutation({
      mutationFn: (item: number) => {
        return getAirlinesData(item);
      },
      onSuccess: (response) => {
        if (response.data && response.data.length > 0) {
          const airlinesOptions = response?.data?.map((item: any) => ({
            value: item?.id.toString(),
            label: item?.name,
          }));
          setAirlines(airlinesOptions);
        }
      },
    });
  function addTicketForm() {
    setAddedTickets([
      ...addedTickets,
      {
        id: `ticket-${addedTickets.length + 1}`,
        flights: [],
        isSubmitted: false,
      },
    ]);
  }
  const { mutate: deleteFlightForm } = useMutation({
    mutationFn: (formId: number) => {
      return deleteFlightData(formId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
    },
  });
  function removeHandler(formId: any) {
    console.log(formId);
    const selectedFlight = addedTickets
      .flatMap((ticket) => ticket.flights)
      .find((flight) => flight.flightId === formId);
    console.log(selectedFlight);
    if (selectedFlight) {
      if (selectedFlight.isSubmitted === true) {
        deleteFlightForm(formId);
      } else {
        const updatedTickets = addedTickets.map((ticket) => ({
          ...ticket,
          flights: ticket.flights.filter(
            (flight: any) => flight.flightId !== formId
          ),
        }));

        setAddedTickets(updatedTickets);
      }
    } else {
      if (addedTickets.length > 0) {
        const updatedTickets = addedTickets.filter(
          (item: any) => item.id !== formId
        );
        setAddedTickets(updatedTickets);
      } else return;
    }
  }

  const { data: ticketData } = useQuery({
    queryKey: ["ticketData"],
    queryFn: async () => await getTicketData(Number(id)),
  });
  useEffect(() => {
    if (ticketData && ticketData?.data?.length > 0) {
      const ticketInfo = ticketData?.data?.map((item: any) => ({
        id: item?.id,
        ticketType: item?.travelType,
        flights: item?.tickets?.map((flight: any) => ({
          flightId: flight?.id,
          flightClass: flight?.ticketClassId,
          flightType: flight?.ticketKindId,
          flightGroupId: flight?.flightGroupId,
          originCityAirport: flight?.baseStationId,
          originTerminal: flight?.baseTerminalId,
          exitDateTime: flight?.exiteDateTime,
          arriveDateTime: flight?.arriveDateTime,
          destinationCityAirport: flight?.destinationStationId,
          destinationTerminal: flight?.destinationTerminalId,
          airline: flight?.transportationCoId,
          isSubmitted: true,
          groupOrder: flight?.groupOrder,
          flightStops: flight?.flightStops?.map((stop: any) => ({
            stopId: stop?.id,
            airport: stop?.stopStationId,
            description: stop?.description,
            isSubmitted: true,
            stopTime: stop?.stopDateTime,
          })),
        })),
        isSubmitted: true,
      }));
      setAddedTickets(ticketInfo);
    } else {
      setAddedTickets([
        {
          id: `ticket-1`,
          isSubmitted: false,
          flights: [],
        },
      ]);
    }
  }, [ticketData]);
  return (
    <div className="bg-card p-6 rounded-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2>سرویس مدیریت پروازها</h2>
        <Button
          variant={"transparent"}
          onClick={addTicketForm}
          className={cn("text-aqua-foreground")}
        >
          <FaPlus />
          افزودن بلیط
        </Button>
      </div>
      <div className="flex flex-col-reverse">
        {addedTickets.map((item) => (
          <TicketForm
            key={item.id}
            onRemoveHandler={removeHandler}
    
            ticket={item}
            flightClasses={flightClasses}
            flightTypes={flightTypes}
            airlines={airlines}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <h2>اطلاعات ثبت کننده</h2>
        {/* <RegisteryForm
        submitForm={SubmitterHandler}
        accountant={
          contract?.userResponsible?.id
            ? contract?.userResponsible?.id.toString()
            : ""
        }
        accountantOptions={userOptions}
        className="flex-row"
      /> */}
      </div>
    </div>
  );
}

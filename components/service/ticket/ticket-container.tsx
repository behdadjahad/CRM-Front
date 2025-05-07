import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TicketForm from "./ticket-form";
import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import { getTicketData } from "@/api/ticket";

export default function TicketContainer({
  transportationType,
}: {
  transportationType: string;
}) {
  const { id } = useParams();
  const [addedTickets, setAddedTickets] = useState<any[]>([]);
  function addTicketForm() {
    setAddedTickets([
      ...addedTickets,
      {
        id: `ticket-${addedTickets.length + 1}`,
        flights:[],
        isSubmitted: false,
      },
    ]);
  }
  // function removeHandler(formId: any) {
  //   if (addedTickets.length > 1) {
  //     const updatedAddedFlights = addedTickets.filter(
  //       (item) => item.id != formId
  //     );
  //     setAddedTickets(updatedAddedFlights);
  //   } else return;
  // }
  function removeHandler(formId: any) {
    // if (addedTickets.length > 1) {
      const updatedAddedFlights = addedTickets.filter(
        (item) => item.flightId != formId
      );
      setAddedTickets(updatedAddedFlights);
    // } else return;
  }

  const { data: ticketData } = useQuery({
    queryKey: ["flightData"],
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
          isSubmitted: true,
          stops: flight?.flightStops?.map((stop: any) => ({
            id: stop?.id,
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
            itemId={item.id}
            onRemoveHandler={removeHandler}
            transportationType={transportationType}
            ticket={item}
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

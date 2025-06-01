import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TicketForm from "./ticket-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import { getTicketData } from "@/api/ticket";
import {
  deleteFlightData,
  deleteTicketData,
  getAirlinesData,
  getFightClassData,
  getFightTypeData,
} from "@/api/flight";
import { getTransportationTypeId } from "@/api/transportation";
import { OptionType } from "@/components/shared/form-maker";
import { insertSubmitterData } from "@/api/client";
import RegisteryForm from "@/components/contract/registery-form";
import { getContractById } from "@/api/contract";
import { getUsers } from "@/api/auth";
import { getCurrencies } from "@/api/currency";

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
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const { mutate: getTransportationType } = useMutation({
    mutationFn: () => {
      return getTransportationTypeId(transportationType);
    },
    onSuccess: (response) => {
      if (response.data?.id) {
        getFlightClass(response.data?.id);
        getFlightType(response.data?.id);
        getAirlines(response.data?.id);
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
          value: item?.id,
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
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
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
      if (addedTickets.length > 1) {
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
          cost: flight?.priceWeBuy,
          currency: flight?.currencyWeBuyId,
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
  const { mutate: SubmitterHandler } = useMutation({
    mutationFn: (data: any) => {
      return insertSubmitterData(data, Number(id));
    },
    onSuccess: () => {},
  });
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
      const userOption: OptionType[] = users?.data?.map((item: any) => ({
        label: item.fullName,
        value: item.id.toString(),
      }));
      setUserOptions(userOption);
    }
  }, [users]);
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
  const { mutate: deleteTicketForm } = useMutation({
    mutationFn: (groupId: number) => {
      return deleteTicketData(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketData"],
      });
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  function removeGroupHandler(groupId: any) {
    const selectedTicket = addedTickets.find(
      (item: any) => item.id === groupId
    );
    if (selectedTicket) {
      if (selectedTicket.isSubmitted) {
        deleteTicketForm(groupId)
      } else {
        if (addedTickets.length > 1) {
          setAddedTickets(
            addedTickets.filter((item: any) => item.id !== groupId)
          );
        } else return;
      }
    } else return;
  }
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
            currencies={currencies}
            onRemoveGroupHandler={removeGroupHandler}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <h2>اطلاعات ثبت کننده</h2>
        <RegisteryForm
          submitForm={SubmitterHandler}
          accountant={
            contract?.data.userResponsible?.id
              ? contract?.data?.userResponsible?.id.toString()
              : ""
          }
          accountantOptions={userOptions}
          className="flex-row"
        />
      </div>
    </div>
  );
}

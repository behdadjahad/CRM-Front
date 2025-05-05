import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import FlightContainer from "./flight-container";
import OneWayTicketForm from "./one-way-ticket-form";
import RoundTripTicketForm from "./round-trip-ticket-form";
import { OptionType } from "@/components/shared/form-maker";
import { getAirports } from "@/api/ticket";
import { useMutation, useQuery } from "@tanstack/react-query";

import Image from "next/image";
import { getTransportationTypeId } from "@/api/transportation";
import {
  getAirlinesData,
  getFightClassData,
  getFightTypeData,
} from "@/api/flight";
export default function TicketForm({
  itemId,
  onRemoveHandler,
  transportationType,
  ticket,
}: {
  itemId: any;
  onRemoveHandler: any;
  transportationType: string;
  ticket: any;
  }) {
  console.log(ticket)
  const [category, setCategory] = useState("one-way");
  const [airports, setAirports] = useState<OptionType[]>([]);
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
  useEffect(() => {
    if (transportationType) {
      getTransportationType();
    }
  }, [transportationType]);

  const { data: airportData } = useQuery({
    queryKey: ["airportData"],
    queryFn: () => getAirports(),
  });

  useEffect(() => {
    if (airportData?.data) {
      const airportOptions = airportData?.data?.map((item: any) => ({
        label: `${item?.city?.name} (${item?.country?.name},${item?.name})`,
        value: item?.id?.toString(),
        icon: (
          <Image
            src={"/icons/location-icon.png"}
            alt="edit"
            width={1024}
            height={1024}
            className="w-4 h-4"
          />
        ),
      }));
      setAirports(airportOptions);
    }
  }, [airportData]);

  return (
    <div className={cn("flex flex-col gap-4 bg-card rounded-md p-3")}>
      <RadioGroup
        defaultValue="one-way"
        className="flex flex-row-reverse gap-4 min-h-10"
      >
        <div className="flex items-center space-x-2">
          <label htmlFor="one-way">یک طرفه</label>
          <RadioGroupItem
            value="one-way"
            id="one-way"
            onClick={() => {
              setCategory("one-way");
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="round-trip">رفت و برگشت</label>
          <RadioGroupItem
            value="round-trip"
            id="round-trip"
            onClick={() => {
              setCategory("round-trip");
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="multi-route">چندمسیره</label>
          <RadioGroupItem
            value="multi-route"
            id="multi-route"
            onClick={() => {
              setCategory("multi-route");
            }}
          />
        </div>
      </RadioGroup>
      {category === "one-way" ? (
        <OneWayTicketForm
          itemId={itemId}
          onRemoveHandler={onRemoveHandler}
          flightClassOptions={flightClasses}
          flightTypeOptions={flightTypes}
          airports={airports}
          airlines={airlines}
        />
      ) : category === "round-trip" ? (
        <RoundTripTicketForm
          itemId={itemId}
          flightClassOptions={flightClasses}
          flightTypeOptions={flightTypes}
          airports={airports}
          airlines={airlines}
        />
      ) : (
        <FlightContainer
          flightClassOptions={flightClasses}
          flightTypeOptions={flightTypes}
          airlines={airlines}
          airports={airports}
        />
      )}
    </div>
  );
}

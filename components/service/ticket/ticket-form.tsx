import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import FlightContainer from "./flight-container";
import OneWayTicketForm from "./one-way-ticket-form";
import RoundTripTicketForm from "./round-trip-ticket-form";
import { OptionType } from "@/components/shared/form-maker";
import { getAirports } from "@/api/ticket";
import { useQuery } from "@tanstack/react-query";

import Image from "next/image";

export default function TicketForm({
  onRemoveHandler,
  ticket,
  flightClasses,
  airlines,
  flightTypes,
  currencies,
  onRemoveGroupHandler,
}: {
  onRemoveHandler: any;
  ticket: any;
  flightClasses: any;
  airlines: any;
  flightTypes: any;
  currencies: any;
  onRemoveGroupHandler: any;
}) {
  const [category, setCategory] = useState(ticket?.ticketType || "OneWay");
  const [airports, setAirports] = useState<OptionType[]>([]);

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
    <div
      className={cn(
        "bg-card flex flex-col rounded-md gap-4 p-6",

      )}
    >
      <RadioGroup
        defaultValue={category}
        className="flex flex-row-reverse gap-4 min-h-10"
      >
        {["OneWay", "TwoWay", "MultiWay"].map((type) => (
          <div className="flex items-center space-x-2" key={type}>
            <label htmlFor={type}>
              {type === "OneWay"
                ? "یک طرفه"
                : type === "TwoWay"
                ? "رفت و برگشت"
                : "چندمسیره"}
            </label>
            <RadioGroupItem
              value={type}
              id={type}
              checked={category === type}
              onClick={() => setCategory(type)}
            />
          </div>
        ))}
      </RadioGroup>

      {category === "OneWay" && (
        <OneWayTicketForm
          ticket={ticket}
          onRemoveHandler={onRemoveHandler}
          flightClassOptions={flightClasses}
          flightTypeOptions={flightTypes}
          airports={airports}
          airlines={airlines}
          currencies={currencies}
        />
      )}

      {category === "TwoWay" && (
        <RoundTripTicketForm
          ticket={ticket}
          onRemoveHandler={onRemoveHandler}
          flightClassOptions={flightClasses}
          flightTypeOptions={flightTypes}
          airports={airports}
          airlines={airlines}
          currencies={currencies}
        />
      )}

      {category === "MultiWay" && (
        <FlightContainer
          ticket={ticket}
          flightClassOptions={flightClasses}
          flightTypeOptions={flightTypes}
          airports={airports}
          airlines={airlines}
          onRemoveHandler={onRemoveHandler}
          currencies={currencies}
          onRemoveGroupHandler={onRemoveGroupHandler}
        />
      )}
    </div>
  );
}

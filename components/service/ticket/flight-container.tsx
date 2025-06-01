import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import FlightForm from "./flight-form";
import { OptionType } from "@/components/shared/form-maker";

export default function FlightContainer({
  flightClassOptions,
  flightTypeOptions,
  airlines,
  airports,
  ticket,
  onRemoveHandler,
  currencies,
  onRemoveGroupHandler,
}: {
  flightClassOptions: any;
  flightTypeOptions: any;
  airlines: OptionType[];
  airports: OptionType[];
  ticket: any;
  onRemoveHandler: any;
  currencies: any;
  onRemoveGroupHandler: any;
}) {
  const [addedFlights, setAddedFlights] = useState<any[]>([]);
  useEffect(() => {
    if (ticket && ticket?.flights?.length > 0) {
      setAddedFlights(ticket.flights);
    } else {
      setAddedFlights([
        {
          flightId: `flight-1`,
          isSubmitted: false,
        },
      ]);
    }
  }, [ticket]);
  function addFlightForm() {
    setAddedFlights([
      ...addedFlights,
      {
        flightId: `flight-${addedFlights.length + 1}`,
        isSubmitted: false,
      },
    ]);
  }
  function removeHandler(flightId: any) {
    const selectedFlight = addedFlights.find(
      (item) => item.flightId === flightId
    );
    if (selectedFlight) {
      if (selectedFlight.isSubmitted) {
        onRemoveHandler(flightId);
      } else {
        if (addedFlights.length > 1) {
          setAddedFlights(
            addedFlights.filter((item) => item.flightId !== flightId)
          );
        } else return;
      }
    } else {
      return;
    }
  }

  return (
    <div className="bg-card rounded-xl flex flex-col gap-4 border border-gray-400 p-3">
      {addedFlights.map((item, index) => (
        <FlightForm
          key={`multi-way-${index}`}
          onRemoveHandler={removeHandler}
          flightClassOptions={flightClassOptions}
          flightTypeOptions={flightTypeOptions}
          count={(index + 1).toString()}
          airlines={airlines}
          airports={airports}
          flight={item}
          ticket={ticket}
          currencies={currencies}
        />
      ))}
      <Button
        variant={"transparent"}
        className={cn("text-aqua-foreground flex justify-end w-full")}
        onClick={addFlightForm}
      >
        <FaPlus />
        اضافه کردن پرواز
      </Button>
      <div className=" flex justify-end w-full">
        {" "}
        <Button
          onClick={() => {
            onRemoveGroupHandler(ticket?.id);
          }}
          className="text-danger border-danger"
          variant={"foreground"}
        >
          حذف بلیط
        </Button>
      </div>
    </div>
  );
}
